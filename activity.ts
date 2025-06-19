import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
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
  
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  try {
    // Since we don't have a dedicated activity log table yet, we'll simulate one
    // by pulling recent data from various tables
    
    // Get recent users
    const recentUsersQuery = `
      SELECT 
        id,
        'user_registration' as type,
        'New User Registration' as title,
        CASE 
          WHEN name IS NOT NULL THEN name || ' (' || email || ') joined as ' || user_type
          ELSE email || ' joined as ' || user_type
        END as description,
        created_at as timestamp,
        json_build_object(
          'userId', id,
          'userName', name,
          'userType', user_type
        ) as metadata
      FROM users
      ORDER BY created_at DESC
      LIMIT 5
    `;
    
    // Get recent projects
    const recentProjectsQuery = `
      SELECT 
        p.id,
        'project_submission' as type,
        'New Project Submitted' as title,
        'Project "' || p.title || '" submitted by ' || COALESCE(u.name, u.email) as description,
        p.created_at as timestamp,
        json_build_object(
          'projectId', p.id,
          'projectTitle', p.title,
          'userId', p.entrepreneur_id,
          'userName', u.name
        ) as metadata
      FROM projects p
      JOIN users u ON p.entrepreneur_id = u.id
      ORDER BY p.created_at DESC
      LIMIT 5
    `;
    
    // Get recent investments
    const recentInvestmentsQuery = `
      SELECT 
        i.id,
        'investment' as type,
        'New Investment' as title,
        COALESCE(u.name, u.email) || ' invested $' || i.amount || ' in "' || p.title || '"' as description,
        i.created_at as timestamp,
        json_build_object(
          'investmentId', i.id,
          'userId', i.investor_id,
          'userName', u.name,
          'projectId', p.id,
          'projectTitle', p.title,
          'amount', i.amount
        ) as metadata
      FROM investments i
      JOIN users u ON i.investor_id = u.id
      JOIN projects p ON i.project_id = p.id
      ORDER BY i.created_at DESC
      LIMIT 5
    `;
    
    const [usersResult, projectsResult, investmentsResult] = await Promise.all([
      pool.query(recentUsersQuery),
      pool.query(recentProjectsQuery),
      pool.query(recentInvestmentsQuery)
    ]);
    
    // Combine and sort by timestamp (most recent first)
    const activities = [
      ...usersResult.rows,
      ...projectsResult.rows,
      ...investmentsResult.rows
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
     .slice(0, 10); // Limit to 10 most recent activities
    
    return res.status(200).json(activities);
  } catch (error) {
    console.error('Error fetching admin activity:', error);
    return res.status(500).json({ message: 'Error fetching admin activity' });
  }
}