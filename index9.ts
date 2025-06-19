import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  try {
    const { name, email, subject, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required' });
    }
    
    const query = `
      INSERT INTO contact_submissions (
        name, 
        email, 
        subject, 
        message
      ) VALUES ($1, $2, $3, $4)
      RETURNING id
    `;
    
    await pool.query(query, [name, email, subject || '', message]);
    
    // In a real app, you would also send an email notification here
    
    return res.status(201).json({ message: 'Contact form submitted successfully' });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return res.status(500).json({ message: 'Error submitting contact form' });
  }
}