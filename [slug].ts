import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query;
  
  if (!slug || typeof slug !== 'string') {
    return res.status(400).json({ message: 'Invalid page slug' });
  }
  
  try {
    // Get page content
    const query = `
      SELECT 
        id, 
        slug, 
        title, 
        content, 
        meta_description, 
        is_published,
        created_at,
        updated_at
      FROM pages
      WHERE slug = $1 AND is_published = true
    `;
    
    const result = await pool.query(query, [slug]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Page not found' });
    }
    
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching page:', error);
    return res.status(500).json({ message: 'Error fetching page' });
  }
}