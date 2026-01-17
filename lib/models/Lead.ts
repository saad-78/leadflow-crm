import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILead extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  source: 'Website' | 'LinkedIn' | 'Referral' | 'Cold Call' | 'Trade Show' | 'Social Media' | 'Email Campaign' | 'Other';
  stage: 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost';
  value: number;
  probability: number;
  notes: string;
  assignedTo: string;
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema = new Schema<ILead>(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxlength: [50, 'First name cannot exceed 50 characters'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      maxlength: [50, 'Last name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    company: {
      type: String,
      required: [true, 'Company is required'],
      trim: true,
      maxlength: [100, 'Company name cannot exceed 100 characters'],
    },
    source: {
      type: String,
      enum: ['Website', 'LinkedIn', 'Referral', 'Cold Call', 'Trade Show', 'Social Media', 'Email Campaign', 'Other'],
      default: 'Website',
    },
    stage: {
      type: String,
      enum: ['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'],
      default: 'New',
    },
    value: {
      type: Number,
      required: [true, 'Lead value is required'],
      min: [0, 'Value cannot be negative'],
      default: 0,
    },
    probability: {
      type: Number,
      min: [0, 'Probability cannot be negative'],
      max: [100, 'Probability cannot exceed 100'],
      default: 0,
    },
    notes: {
      type: String,
      default: '',
      maxlength: [2000, 'Notes cannot exceed 2000 characters'],
    },
    assignedTo: {
      type: String,
      default: 'Unassigned',
    },
  },
  {
    timestamps: true,
  }
);

// Index for better search performance
LeadSchema.index({ firstName: 'text', lastName: 'text', email: 'text', company: 'text' });
LeadSchema.index({ stage: 1, createdAt: -1 });
LeadSchema.index({ source: 1 });
LeadSchema.index({ assignedTo: 1 });

const Lead: Model<ILead> = mongoose.models.Lead || mongoose.model<ILead>('Lead', LeadSchema);

export default Lead;
