'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Lead, LeadStage } from '@/lib/types';

const stageStyles: Record<LeadStage, { bg: string; text: string }> = {
  'New': { bg: 'bg-blue-100', text: 'text-blue-800' },
  'Contacted': { bg: 'bg-indigo-100', text: 'text-indigo-800' },
  'Qualified': { bg: 'bg-purple-100', text: 'text-purple-800' },
  'Proposal': { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  'Negotiation': { bg: 'bg-orange-100', text: 'text-orange-800' },
  'Won': { bg: 'bg-green-100', text: 'text-green-800' },
  'Lost': { bg: 'bg-red-100', text: 'text-red-800' },
};

export default function RecentLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeads() {
      try {
        const response = await fetch('/api/leads?limit=5&sortField=createdAt&sortDirection=desc');
        if (response.ok) {
          const data = await response.json();
          setLeads(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch recent leads:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchLeads();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-80 animate-pulse">
        <div className="h-full bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Recent Leads</h3>
            <p className="text-sm text-gray-500">Latest additions to your pipeline</p>
          </div>
          <Link
            href="/leads"
            className="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            View all →
          </Link>
        </div>
      </div>
      <div className="divide-y divide-gray-100">
        {leads.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500">No leads yet. Start by seeding some data!</p>
          </div>
        ) : (
          leads.map((lead) => (
            <Link
              key={lead._id}
              href={`/leads/${lead._id}`}
              className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-700 font-medium">
                    {lead.firstName.charAt(0)}{lead.lastName.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {lead.firstName} {lead.lastName}
                  </p>
                  <p className="text-sm text-gray-500">{lead.company}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${stageStyles[lead.stage].bg} ${stageStyles[lead.stage].text}`}>
                  {lead.stage}
                </span>
                <span className="text-sm text-gray-500">
                  {format(new Date(lead.createdAt), 'MMM d')}
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
