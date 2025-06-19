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
  
  switch (req.method) {
    case 'POST':
      return await createInvestment(req, res, session);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

async function createInvestment(req: NextApiRequest, res: NextApiResponse, session: any) {
  if (session.user.userType !== UserType.INVESTOR) {
    return res.status(403).json({ message: 'Only investors can make investments' });
  }
  
  const { projectId, amount, platformFee } = req.body;
  
  if (!projectId || !amount) {
    return res.status(400).json({ message: 'Project ID and amount are required' });
  }
  
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Check if project exists and is approved
    const projectResult = await client.query(
      'SELECT * FROM projects WHERE id = $1 AND status = $2',
      [projectId, 'approved']
    );
    
    if (projectResult.rows.length === 0) {
      throw new Error('Project not found or not approved');
    }
    
    const project = projectResult.rows[0];
    
    // Check if amount meets minimum investment
    if (amount < project.minimum_investment) {
      throw new Error(`Minimum investment amount is $${project.minimum_investment}`);
    }
    
    // Create investment
    const investmentResult = await client.query(
      `INSERT INTO investments (
        investor_id, 
        project_id, 
        amount, 
        platform_fee, 
        status
      ) VALUES ($1, $2, $3, $4, $5) 
      RETURNING *`,
      [parseInt(session.user.id), projectId, amount, platformFee || 0, 'completed']
    );
    
    await client.query('COMMIT');
    
    const investment = investmentResult.rows[0];
    
    return res.status(201).json({
      id: investment.id,
      investorId: investment.investor_id,
      projectId: investment.project_id,
      amount: investment.amount,
      platformFee: investment.platform_fee,
      status: investment.status,
      createdAt: investment.created_at
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating investment:', error);
    return res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Error processing investment' 
    });
  } finally {
    client.release();
  }
}