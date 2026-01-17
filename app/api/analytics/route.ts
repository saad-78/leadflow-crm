import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Lead from '@/lib/models/Lead';
import { AnalyticsMetrics, LeadStage, LeadSource } from '@/lib/types';

export async function GET() {
  try {
    const connected = await dbConnect();
    if (!connected) {
      return NextResponse.json(
        { error: 'Database not connected. Please configure MONGODB_URI.' },
        { status: 503 }
      );
    }

    // Total leads
    const totalLeads = await Lead.countDocuments();

    // Total pipeline value (excluding Lost)
    const pipelineValueResult = await Lead.aggregate([
      { $match: { stage: { $ne: 'Lost' } } },
      { $group: { _id: null, total: { $sum: '$value' } } },
    ]);
    const totalValue = pipelineValueResult[0]?.total || 0;

    // Converted leads (Won)
    const convertedCount = await Lead.countDocuments({ stage: 'Won' });
    const conversionRate = totalLeads > 0 ? (convertedCount / totalLeads) * 100 : 0;

    // Leads by stage
    const leadsByStage = await Lead.aggregate([
      {
        $group: {
          _id: '$stage',
          count: { $sum: 1 },
          value: { $sum: '$value' },
        },
      },
      { $sort: { count: -1 } },
    ]);

    const stageOrder: Record<string, number> = {
      'New': 0,
      'Contacted': 1,
      'Qualified': 2,
      'Proposal': 3,
      'Negotiation': 4,
      'Won': 5,
      'Lost': 6,
    };

    const leadsByStageFormatted = leadsByStage.map((item) => ({
      stage: item._id as LeadStage,
      count: item.count as number,
      value: item.value as number,
    })).sort((a, b) => stageOrder[a.stage] - stageOrder[b.stage]);

    // Leads by source
    const leadsBySource = await Lead.aggregate([
      {
        $group: {
          _id: '$source',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    const leadsBySourceFormatted = leadsBySource.map((item) => ({
      source: item._id as LeadSource,
      count: item.count as number,
    }));

    // Average deal size (for Won deals)
    const wonDeals = await Lead.find({ stage: 'Won' });
    const totalWonValue = wonDeals.reduce((sum, lead) => sum + lead.value, 0);
    const averageDealSize = wonDeals.length > 0 ? totalWonValue / wonDeals.length : 0;

    const metrics: AnalyticsMetrics = {
      totalLeads,
      totalValue,
      convertedLeads: convertedCount,
      conversionRate: Math.round(conversionRate * 100) / 100,
      leadsByStage: leadsByStageFormatted,
      leadsBySource: leadsBySourceFormatted,
      averageDealSize: Math.round(averageDealSize),
      totalWonValue,
    };

    return NextResponse.json(metrics);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
