import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/lib/db';
import { ProjectStatus } from '@/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ message: 'Invalid project ID' });
    }
    
    const projectId = parseInt(id as string);
    
    switch (req.method) {
      case 'GET':
        return await getProjectById(projectId, res);
      default:
        return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in project API:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function getProjectById(projectId: number, res: NextApiResponse) {
  try {
    // Get project details
    const query = `
      SELECT 
        p.id, 
        p.entrepreneur_id as "entrepreneurId",
        u.name as "entrepreneurName",
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
      JOIN users u ON p.entrepreneur_id = u.id
      WHERE p.id = $1
    `;
    
    const result = await pool.query(query, [projectId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    const project = result.rows[0];
    
    // Get project media
    const mediaQuery = `
      SELECT 
        id,
        project_id as "projectId", 
        media_type as "mediaType", 
        media_url as "mediaUrl", 
        created_at as "createdAt"
      FROM project_media
      WHERE project_id = $1
    `;
    
    const mediaResult = await pool.query(mediaQuery, [projectId]);
    
    // Add media to project
    project.media = mediaResult.rows;
    
    return res.status(200).json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    return res.status(500).json({ message: 'Error fetching project' });
  }
}