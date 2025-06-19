import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';
import pool from '@/lib/db';
import { UserType } from '@/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  if (session.user.userType !== UserType.ADMIN) {
    return res.status(403).json({ message: 'Access denied' });
  }
  
  switch (req.method) {
    case 'GET':
      return await getPages(req, res);
    case 'POST':
      return await createPage(req, res);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

async function getPages(req: NextApiRequest, res: NextApiResponse) {
  try {
    const query = `
      SELECT 
        id, 
        slug, 
        title, 
        meta_description, 
        is_published, 
        updated_at
      FROM pages
      ORDER BY updated_at DESC
    `;
    
    const result = await pool.query(query);
    
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching pages:', error);
    return res.status(500).json({ message: 'Error fetching pages' });
  }
}

async function createPage(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { title, slug, content, meta_description, is_published } = req.body;
    
    if (!title || !slug || !content) {
      return res.status(400).json({ message: 'Title, slug, and content are required' });
    }
    
    // Check if slug already exists
    const checkQuery = `
      SELECT id FROM pages WHERE slug = $1
    `;
    
    const checkResult = await pool.query(checkQuery, [slug]);
    
    if (checkResult.rows.length > 0) {
      return res.status(400).json({ message: 'A page with this slug already exists' });
    }
    
    const query = `
      INSERT INTO pages (
        slug,
        title,
        content,
        meta_description,
        is_published
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `;
    
    const result = await pool.query(query, [
      slug,
      title,
      content,
      meta_description || '',
      is_published
    ]);
    
    return res.status(201).json({
      id: result.rows[0].id,
      message: 'Page created successfully'
    });
  } catch (error) {
    console.error('Error creating page:', error);
    return res.status(500).json({ message: 'Error creating page' });
  }
}