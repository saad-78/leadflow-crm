import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Lead from '@/lib/models/Lead';
import { LeadSource, LeadStage } from '@/lib/types';

// Simple random data generator (lightweight alternative to faker)
const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen', 'Christopher', 'Lisa', 'Daniel', 'Nancy', 'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra', 'Donald', 'Ashley', 'Steven', 'Kimberly', 'Paul', 'Emily', 'Andrew', 'Donna', 'Joshua', 'Michelle', 'Kenneth', 'Dorothy', 'Kevin', 'Carol', 'Brian', 'Amanda', 'George', 'Melissa', 'Edward', 'Deborah', 'Timothy', 'Stephanie'];

const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts'];

const companies = ['TechCorp Solutions', 'Global Industries', 'Innovative Systems', 'Digital Ventures', 'Enterprise Group', 'Prime Technologies', 'Future Dynamics', 'Apex Solutions', 'Quantum Labs', 'Stellar Industries', 'Horizon Enterprises', 'Summit Partners', 'Velocity Group', 'Pinnacle Tech', 'Catalyst Solutions', 'Synergy Inc', 'BlueOcean Technologies', 'RedRock Ventures', 'GreenField Systems', 'SilverLine Corp', 'Golden Gate Tech', 'IronClad Solutions', 'SteelCity Industries', 'Crystal Dynamics', 'Diamond Technologies', 'Platinum Group', 'Titan Industries', 'Atlas Solutions', 'Omega Technologies', 'Delta Force Inc'];

const sources: LeadSource[] = ['Website', 'LinkedIn', 'Referral', 'Cold Call', 'Trade Show', 'Social Media', 'Email Campaign', 'Other'];
const stages: LeadStage[] = ['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'];

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function generatePhoneNumber(): string {
  return `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`;
}

function generateEmail(firstName: string, lastName: string, company: string): string {
  const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'company.com', 'corp.com', 'inc.com', 'net.com'];
  const formats = [
    `${firstName.toLowerCase()}.${lastName.toLowerCase()}`,
    `${firstName.toLowerCase()}${lastName.charAt(0).toLowerCase()}`,
    `${firstName.charAt(0).toLowerCase()}${lastName.toLowerCase()}`,
    `${firstName.toLowerCase()}${Math.floor(Math.random() * 100)}`,
  ];
  const format = randomElement(formats);
  const domain = randomElement(domains);
  return `${format}@${domain}`;
}

interface GenerateLeadOptions {
  index: number;
}

function generateLead({ index }: GenerateLeadOptions) {
  const firstName = randomElement(firstNames);
  const lastName = randomElement(lastNames);
  const company = randomElement(companies);
  
  const stage = randomElement(stages);
  
  // Value based on stage (more advanced stages have higher values)
  let baseValue = Math.floor(Math.random() * 50000) + 1000;
  const stageMultipliers: Record<LeadStage, number> = {
    'New': 0.8,
    'Contacted': 0.9,
    'Qualified': 1.0,
    'Proposal': 1.2,
    'Negotiation': 1.4,
    'Won': 1.5,
    'Lost': 0.5,
  };
  baseValue = Math.floor(baseValue * stageMultipliers[stage]);
  
  // Probability based on stage
  const stageProbabilities: Record<LeadStage, number> = {
    'New': Math.floor(Math.random() * 20) + 5,
    'Contacted': Math.floor(Math.random() * 25) + 10,
    'Qualified': Math.floor(Math.random() * 30) + 20,
    'Proposal': Math.floor(Math.random() * 30) + 40,
    'Negotiation': Math.floor(Math.random() * 25) + 50,
    'Won': 100,
    'Lost': 0,
  };

  const source = randomElement(sources);
  const assignedTo = randomElement([...firstNames.slice(0, 10), 'Unassigned']);

  return {
    firstName,
    lastName,
    email: generateEmail(firstName, lastName, company),
    phone: generatePhoneNumber(),
    company,
    source,
    stage,
    value: baseValue,
    probability: stageProbabilities[stage],
    notes: `Generated lead #${index}. ${firstName} ${lastName} from ${company}. Interested in our products/services. ${source === 'Referral' ? 'Referred by existing customer.' : ''}`,
    assignedTo,
    createdAt: randomDate(new Date('2023-01-01'), new Date()),
    updatedAt: new Date(),
  };
}

export async function GET(request: NextRequest) {
  try {
    const connected = await dbConnect();
    if (!connected) {
      return NextResponse.json(
        { error: 'Database not connected. Please configure MONGODB_URI.' },
        { status: 503 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const count = parseInt(searchParams.get('count') || '500');

    // Check if leads already exist
    const existingCount = await Lead.countDocuments();
    if (existingCount > 0) {
      return NextResponse.json({
        message: `Database already contains ${existingCount} leads. Use DELETE /api/seed to clear or add more.`,
        existingCount,
        action: 'skip',
      });
    }

    // Generate leads
    const leads = [];
    for (let i = 0; i < count; i++) {
      leads.push(generateLead({ index: i + 1 }));
    }

    // Insert all leads
    await Lead.insertMany(leads);

    return NextResponse.json({
      message: `Successfully seeded ${count} leads`,
      count,
      action: 'created',
    });
  } catch (error) {
    console.error('Error seeding leads:', error);
    return NextResponse.json(
      { error: 'Failed to seed leads' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const connected = await dbConnect();
    if (!connected) {
      return NextResponse.json(
        { error: 'Database not connected. Please configure MONGODB_URI.' },
        { status: 503 }
      );
    }

    const result = await Lead.deleteMany({});

    return NextResponse.json({
      message: `Successfully deleted ${result.deletedCount} leads`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error('Error deleting leads:', error);
    return NextResponse.json(
      { error: 'Failed to delete leads' },
      { status: 500 }
    );
  }
}
