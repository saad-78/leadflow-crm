import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Lead from '@/lib/models/Lead';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const connected = await dbConnect();
    if (!connected) {
      return NextResponse.json(
        { error: 'Database not connected. Please configure MONGODB_URI.' },
        { status: 503 }
      );
    }

    const lead = await Lead.findById(params.id).lean();

    if (!lead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }

    const transformedLead = {
      ...lead,
      _id: lead._id.toString(),
      id: lead._id.toString(),
    };

    return NextResponse.json(transformedLead);
  } catch (error) {
    console.error('Error fetching lead:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lead' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const connected = await dbConnect();
    if (!connected) {
      return NextResponse.json(
        { error: 'Database not connected. Please configure MONGODB_URI.' },
        { status: 503 }
      );
    }

    const body = await request.json();

    const lead = await Lead.findByIdAndUpdate(
      params.id,
      { $set: body },
      { new: true, runValidators: true }
    ).lean();

    if (!lead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }

    const transformedLead = {
      ...lead,
      _id: lead._id.toString(),
      id: lead._id.toString(),
    };

    return NextResponse.json(transformedLead);
  } catch (error) {
    console.error('Error updating lead:', error);
    return NextResponse.json(
      { error: 'Failed to update lead' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const connected = await dbConnect();
    if (!connected) {
      return NextResponse.json(
        { error: 'Database not connected. Please configure MONGODB_URI.' },
        { status: 503 }
      );
    }

    const lead = await Lead.findByIdAndDelete(params.id);

    if (!lead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    console.error('Error deleting lead:', error);
    return NextResponse.json(
      { error: 'Failed to delete lead' },
      { status: 500 }
    );
  }
}
