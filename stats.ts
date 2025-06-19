import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/lib/db';
import { ProjectStatus } from '@/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  try {
    // Execute queries in parallel
    const [
      projectsResult,
      entrepreneursResult,
      investorsResult,
      investmentResult
    ] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM projects WHERE status = $1', [ProjectStatus.APPROVED]),
      pool.query('SELECT COUNT(*) FROM users WHERE user_type = $1', ['entrepreneur']),
      pool.query('SELECT COUNT(*) FROM users WHERE user_type = $1', ['investor']),
      pool.query('SELECT COALESCE(SUM(amount), 0) as total FROM investments')
    ]);
    
    const stats = {
      projectCount: parseInt(projectsResult.rows[0].count),
      entrepreneurCount: parseInt(entrepreneursResult.rows[0].count),
      investorCount: parseInt(investorsResult.rows[0].count),
      totalInvestment: parseFloat(investmentResult.rows[0].total)
    };
    
    return res.status(200).json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    return res.status(500).json({ message: 'Error fetching platform statistics' });
  }
}