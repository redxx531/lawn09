import { NextApiRequest, NextApiResponse } from 'next';
import { hash } from 'bcryptjs';
import pool from '@/lib/db';
import { UserType } from '@/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  try {
    const { email, password, name, userType } = req.body;
    
    if (!email || !password || !userType) {
      return res.status(400).json({ message: 'Email, password, and user type are required' });
    }
    
    // Validate user type
    if (!Object.values(UserType).includes(userType)) {
      return res.status(400).json({ message: 'Invalid user type' });
    }
    
    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await hash(password, 10);
    
    // Create user
    const result = await pool.query(
      'INSERT INTO users (email, password, name, user_type) VALUES ($1, $2, $3, $4) RETURNING id, email, name, user_type',
      [email, hashedPassword, name || null, userType]
    );
    
    return res.status(201).json({ 
      user: {
        id: result.rows[0].id,
        email: result.rows[0].email,
        name: result.rows[0].name,
        userType: result.rows[0].user_type,
      } 
    });
  } catch (error) {
    console.error('Error during registration:', error);
    return res.status(500).json({ message: 'Error during registration' });
  }
}