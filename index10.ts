import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  try {
    const query = `
      SELECT 
        id, 
        question, 
        answer, 
        category, 
        display_order
      FROM faqs
      ORDER BY category, display_order
    `;
    
    const result = await pool.query(query);
    
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return res.status(500).json({ message: 'Error fetching FAQs' });
  }
}