import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import pool from '@/lib/db';
import { ProjectStatus, UserType } from '@/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET':
        return await getProjects(req, res);
      case 'POST':
        return await createProject(req, res);
      default:
        return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in projects API:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function getProjects(req: NextApiRequest, res: NextApiResponse) {
  // This endpoint is public - no auth required
  try {
    // Only return approved projects
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
      WHERE p.status = $1
      ORDER BY p.is_featured DESC, p.created_at DESC
    `;
    
    const result = await pool.query(query, [ProjectStatus.APPROVED]);
    
    // Get media for all projects
    const mediaResult = await pool.query(
      `SELECT 
        project_id as "projectId", 
        media_type as "mediaType", 
        media_url as "mediaUrl", 
        created_at as "createdAt"
      FROM project_media`
    );
    
    // Map media to projects
    const projects = result.rows.map(project => ({
      ...project,
      media: mediaResult.rows.filter(media => media.projectId === project.id)
    }));
    
    return res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return res.status(500).json({ message: 'Error fetching projects' });
  }
}

async function createProject(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  if (session.user.userType !== UserType.ENTREPRENEUR) {
    return res.status(403).json({ message: 'Only entrepreneurs can create projects' });
  }
  
  const { 
    title, 
    description, 
    category, 
    minimumInvestment, 
    rewardType, 
    rewardDescription, 
    media 
  } = req.body;
  
  // Validate required fields
  if (!title || !description || !category || !minimumInvestment || !rewardType || !rewardDescription) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  
  // Validate media
  if (!media || !Array.isArray(media) || media.length === 0) {
    return res.status(400).json({ message: 'At least one media item is required' });
  }
  
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Create project
    const projectResult = await client.query(
      `INSERT INTO projects (
        entrepreneur_id, 
        title, 
        description, 
        minimum_investment, 
        reward_type, 
        reward_description, 
        category, 
        status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
      RETURNING *`,
      [
        parseInt(session.user.id), 
        title, 
        description, 
        minimumInvestment, 
        rewardType, 
        rewardDescription, 
        category, 
        ProjectStatus.PENDING
      ]
    );
    
    const project = projectResult.rows[0];
    
    // Add media
    for (const item of media) {
      await client.query(
        `INSERT INTO project_media (
          project_id, 
          media_type, 
          media_url
        ) VALUES ($1, $2, $3)`,
        [project.id, item.type, item.url]
      );
    }
    
    await client.query('COMMIT');
    
    return res.status(201).json({
      id: project.id,
      entrepreneurId: project.entrepreneur_id,
      title: project.title,
      description: project.description,
      minimumInvestment: project.minimum_investment,
      rewardType: project.reward_type,
      rewardDescription: project.reward_description,
      category: project.category,
      status: project.status,
      isFeatured: project.is_featured,
      createdAt: project.created_at,
      updatedAt: project.updated_at
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating project:', error);
    return res.status(500).json({ message: 'Error creating project' });
  } finally {
    client.release();
  }
}