import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  try {
    const query = `
      SELECT 
        b.id, 
        b.title, 
        b.slug, 
        b.excerpt, 
        b.featured_image_url, 
        b.created_at,
        b.is_published,
        u.name as author_name
      FROM blog_posts b
      LEFT JOIN users u ON b.author_id = u.id
      WHERE b.is_published = true
      ORDER BY b.created_at DESC
    `;
    
    const result = await pool.query(query);
    
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return res.status(500).json({ message: 'Error fetching blog posts' });
  }
}