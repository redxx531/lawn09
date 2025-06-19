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
      return await getSettings(req, res);
    case 'PUT':
      return await updateSettings(req, res);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

async function getSettings(req: NextApiRequest, res: NextApiResponse) {
  try {
    const query = `
      SELECT 
        setting_key, 
        setting_value,
        setting_type
      FROM site_settings
    `;
    
    const result = await pool.query(query);
    
    // Convert to key-value object for easier management in the UI
    const settings = result.rows.reduce((acc, row) => {
      return {
        ...acc,
        [row.setting_key]: row.setting_value
      };
    }, {});
    
    return res.status(200).json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return res.status(500).json({ message: 'Error fetching settings' });
  }
}

async function updateSettings(req: NextApiRequest, res: NextApiResponse) {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const settings = req.body;
    
    // Update each setting
    for (const [key, value] of Object.entries(settings)) {
      // Retrieve the setting type
      const typeResult = await client.query(
        'SELECT setting_type FROM site_settings WHERE setting_key = $1',
        [key]
      );
      
      if (typeResult.rows.length > 0) {
        await client.query(
          `UPDATE site_settings 
           SET setting_value = $1, updated_at = NOW()
           WHERE setting_key = $2`,
          [value, key]
        );
      }
    }
    
    await client.query('COMMIT');
    
    return res.status(200).json({ message: 'Settings updated successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating settings:', error);
    return res.status(500).json({ message: 'Error updating settings' });
  } finally {
    client.release();
  }
}