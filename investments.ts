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
  
  if (session.user.userType !== UserType.INVESTOR) {
    return res.status(403).json({ message: 'Access denied' });
  }
  
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  try {
    const userId = parseInt(session.user.id);
    
    // Get investments made by the investor
    const query = `
      SELECT 
        i.id, 
        i.investor_id as "investorId",
        i.project_id as "projectId",
        p.title as "projectTitle",
        i.amount, 
        i.platform_fee as "platformFee", 
        i.status, 
        i.created_at as "createdAt"
      FROM investments i
      JOIN projects p ON i.project_id = p.id
      WHERE i.investor_id = $1
      ORDER BY i.created_at DESC
    `;
    
    const result = await pool.query(query, [userId]);
    
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching investor investments:', error);
    return res.status(500).json({ message: 'Error fetching investor investments' });
  }
}