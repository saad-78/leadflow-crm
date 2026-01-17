export interface Lead {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  source: LeadSource;
  stage: LeadStage;
  value: number;
  probability: number;
  notes: string;
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
}

export type LeadSource = 
  | 'Website' 
  | 'LinkedIn' 
  | 'Referral' 
  | 'Cold Call' 
  | 'Trade Show' 
  | 'Social Media' 
  | 'Email Campaign' 
  | 'Other';

export type LeadStage = 
  | 'New' 
  | 'Contacted' 
  | 'Qualified' 
  | 'Proposal' 
  | 'Negotiation' 
  | 'Won' 
  | 'Lost';

export interface LeadsResponse {
  data: Lead[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface LeadFilters {
  search?: string;
  stage?: LeadStage;
  source?: LeadSource;
  minValue?: number;
  maxValue?: number;
  startDate?: string;
  endDate?: string;
  assignedTo?: string;
}

export interface LeadSort {
  field: keyof Lead;
  direction: 'asc' | 'desc';
}

export interface AnalyticsMetrics {
  totalLeads: number;
  totalValue: number;
  convertedLeads: number;
  conversionRate: number;
  leadsByStage: { stage: LeadStage; count: number; value: number }[];
  leadsBySource: { source: LeadSource; count: number }[];
  averageDealSize: number;
  totalWonValue: number;
}

export interface User {
  email: string;
  name: string;
  image?: string;
}
