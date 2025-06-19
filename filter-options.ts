import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  try {
    // Get unique categories
    const categoriesQuery = `
      SELECT DISTINCT category
      FROM projects
      WHERE status = 'approved'
      ORDER BY category
    `;
    
    // Get unique reward types
    const rewardTypesQuery = `
      SELECT DISTINCT reward_type
      FROM projects
      WHERE status = 'approved'
      ORDER BY reward_type
    `;
    
    const [categoriesResult, rewardTypesResult] = await Promise.all([
      pool.query(categoriesQuery),
      pool.query(rewardTypesQuery)
    ]);
    
    const categories = categoriesResult.rows.map(row => row.category);
    const rewardTypes = rewardTypesResult.rows.map(row => row.reward_type);
    
    return res.status(200).json({
      categories,
      rewardTypes
    });
  } catch (error) {
    console.error('Error fetching filter options:', error);
    return res.status(500).json({ message: 'Error fetching filter options' });
  }
}