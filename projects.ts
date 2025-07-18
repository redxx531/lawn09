import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import pool from '@/lib/db';
import { UserType } from '@/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  if (session.user.userType !== UserType.ENTREPRENEUR) {
    return res.status(403).json({ message: 'Access denied' });
  }
  
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  try {
    const userId = parseInt(session.user.id);
    
    // Get projects created by the entrepreneur
    const query = `
      SELECT 
        p.id, 
        p.entrepreneur_id as "entrepreneurId",
        p.title, 
        p.description, 
        p.minimum_investment as "minimumInvestment", 
        p.reward_type as "rewardType", 
        p.reward_description as "rewardDescription", 
        p.category, 
        p.status, 
        p.is_featured as "isFeatured", 
        p.created_at as "createdAt", 
        p.updated_at as "updatedAt",
        (SELECT COUNT(*) FROM investments i WHERE i.project_id = p.id) as "investorCount",
        (SELECT COALESCE(SUM(amount), 0) FROM investments i WHERE i.project_id = p.id) as "totalInvestment"
      FROM projects p
      WHERE p.entrepreneur_id = $1
      ORDER BY p.created_at DESC
    `;
    
    const result = await pool.query(query, [userId]);
    
    // Get media for all projects
    const projectIds = result.rows.map(p => p.id);
    
    if (projectIds.length > 0) {
      const mediaQuery = `
        SELECT 
          project_id as "projectId", 
          media_type as "mediaType", 
          media_url as "mediaUrl", 
          created_at as "createdAt"
        FROM project_media
        WHERE project_id = ANY($1)
      `;
      
      const mediaResult = await pool.query(mediaQuery, [projectIds]);
      
      // Map media to projects
      const projects = result.rows.map(project => ({
        ...project,
        media: mediaResult.rows.filter(media => media.projectId === project.id)
      }));
      
      return res.status(200).json(projects);
    }
    
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching entrepreneur projects:', error);
    return res.status(500).json({ message: 'Error fetching entrepreneur projects' });
  }
}