import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Lead from '@/lib/models/Lead';

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
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const stage = searchParams.get('stage') || '';
    const source = searchParams.get('source') || '';
    const minValue = searchParams.get('minValue');
    const maxValue = searchParams.get('maxValue');
    const startDate = searchParams.get('startDate') || '';
    const endDate = searchParams.get('endDate') || '';
    const sortField = searchParams.get('sortField') || 'createdAt';
    const sortDirection = searchParams.get('sortDirection') || 'desc';

    // Build query
    const query: Record<string, unknown> = {};

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
      ];
    }

    if (stage) {
      query.stage = stage;
    }

    if (source) {
      query.source = source;
    }

    if (minValue || maxValue) {
      query.value = {};
      if (minValue) (query.value as Record<string, number>).$gte = parseFloat(minValue);
      if (maxValue) (query.value as Record<string, number>).$lte = parseFloat(maxValue);
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) (query.createdAt as Record<string, Date>).$gte = new Date(startDate);
      if (endDate) (query.createdAt as Record<string, Date>).$lte = new Date(endDate);
    }

    // Build sort
    const sort: Record<string, 1 | -1> = {};
    sort[sortField] = sortDirection === 'asc' ? 1 : -1;

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const [leads, total] = await Promise.all([
      Lead.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Lead.countDocuments(query),
    ]);

    // Transform _id to id for frontend
    const transformedLeads = leads.map((lead) => ({
      ...lead,
      _id: lead._id.toString(),
      id: lead._id.toString(),
    }));

    const pages = Math.ceil(total / limit);

    return NextResponse.json({
      data: transformedLeads,
      meta: {
        total,
        page,
        limit,
        pages,
      },
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const connected = await dbConnect();
    if (!connected) {
      return NextResponse.json(
        { error: 'Database not connected. Please configure MONGODB_URI.' },
        { status: 503 }
      );
    }

    const body = await request.json();

    const lead = await Lead.create(body);

    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json(
      { error: 'Failed to create lead' },
      { status: 500 }
    );
  }
}
