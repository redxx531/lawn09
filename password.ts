import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { compare, hash } from 'bcryptjs';
import pool from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }
    
    // Get user's current password hash
    const userQuery = `
      SELECT password FROM users WHERE id = $1
    `;
    
    const userResult = await pool.query(userQuery, [session.user.id]);
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const passwordHash = userResult.rows[0].password;
    
    // Verify current password
    const isPasswordValid = await compare(currentPassword, passwordHash);
    
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    
    // Hash new password
    const newPasswordHash = await hash(newPassword, 10);
    
    // Update password
    const updateQuery = `
      UPDATE users
      SET password = $1
      WHERE id = $2
    `;
    
    await pool.query(updateQuery, [newPasswordHash, session.user.id]);
    
    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    return res.status(500).json({ message: 'Error changing password' });
  }
}