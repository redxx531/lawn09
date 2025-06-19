import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  try {
    const query = `
      SELECT 
        setting_key, 
        setting_value,
        setting_type
      FROM site_settings
    `;
    
    const result = await pool.query(query);
    
    // Convert to key-value object
    const settings = result.rows.reduce((acc, row) => {
      // Convert number type settings to numbers
      const value = row.setting_type === 'number' 
        ? Number(row.setting_value) 
        : row.setting_value;
        
      return {
        ...acc,
        [row.setting_key]: value
      };
    }, {});
    
    return res.status(200).json(settings);
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return res.status(500).json({ message: 'Error fetching site settings' });
  }
}