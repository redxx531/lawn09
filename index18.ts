export interface User {
  id: number;
  name: string;
  email: string;
  userType: UserType;
  createdAt: string;
}

export enum UserType {
  ENTREPRENEUR = 'entrepreneur',
  INVESTOR = 'investor',
  ADMIN = 'admin'
}

export interface Project {
  id: number;
  entrepreneurId: number;
  entrepreneurName: string;
  title: string;
  description: string;
  minimumInvestment: number;
  rewardType: string;
  rewardDescription: string;
  category: string;
  status: ProjectStatus;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  media?: ProjectMedia[];
  totalInvestment?: number;
  investorCount?: number;
}

export enum ProjectStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export interface ProjectMedia {
  id: number;
  projectId: number;
  mediaType: 'image' | 'video';
  mediaUrl: string;
  createdAt: string;
}

export interface Investment {
  id: number;
  investorId: number;
  investorName: string;
  projectId: number;
  projectTitle: string;
  amount: number;
  platformFee: number;
  status: 'pending' | 'completed' | 'refunded';
  createdAt: string;
}

export interface Report {
  id: number;
  reporterId: number;
  projectId: number;
  reason: string;
  status: 'pending' | 'reviewed' | 'resolved';
  createdAt: string;
}

export interface AdminDashboardStats {
  totalUsers: number;
  totalProjects: number;
  totalInvestments: number;
  totalAmountInvested: number;
  pendingProjects: number;
}

// NextAuth types extension
declare module "next-auth" {
  interface User {
    id: string;
    name: string;
    email: string;
    userType: UserType;
  }

  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      userType: UserType;
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    userType: UserType;
  }
}