import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import pool from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  const session = await getServerSession(req, res, authOptions);
  
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  try {
    const { projectId, reason } = req.body;
    
    if (!projectId || !reason) {
      return res.status(400).json({ message: 'Project ID and reason are required' });
    }
    
    // Create report
    await pool.query(
      `INSERT INTO reports (
        reporter_id, 
        project_id, 
        reason, 
        status
      ) VALUES ($1, $2, $3, $4)`,
      [parseInt(session.user.id), projectId, reason, 'pending']
    );
    
    return res.status(201).json({ message: 'Report submitted successfully' });
  } catch (error) {
    console.error('Error submitting report:', error);
    return res.status(500).json({ message: 'Error submitting report' });
  }
}