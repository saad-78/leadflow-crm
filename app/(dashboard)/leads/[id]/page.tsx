'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Mail, 
  Phone, 
  Building, 
  MapPin,
  Calendar,
  DollarSign,
  Target,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { Lead, LeadStage } from '@/lib/types';

const stageStyles: Record<LeadStage, { bg: string; text: string; border: string; icon: string }> = {
  'New': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: '🌟' },
  'Contacted': { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', icon: '📞' },
  'Qualified': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', icon: '✓' },
  'Proposal': { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', icon: '📋' },
  'Negotiation': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', icon: '🤝' },
  'Won': { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', icon: '🎉' },
  'Lost': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: '❌' },
};

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLead() {
      try {
        const response = await fetch(`/api/leads/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setLead(data);
        } else {
          setError('Lead not found');
        }
      } catch (error) {
        console.error('Failed to fetch lead:', error);
        setError('Failed to load lead');
      } finally {
        setLoading(false);
      }
    }

    fetchLead();
  }, [params.id]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this lead?')) return;

    try {
      const response = await fetch(`/api/leads/${params.id}`, { method: 'DELETE' });
      if (response.ok) {
        router.push('/leads');
      }
    } catch (error) {
      console.error('Failed to delete lead:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="h-10 bg-gray-200 rounded w-3/4 mb-6"></div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Lead Not Found</h2>
        <p className="text-gray-500 mb-6">{error || 'The lead you are looking for does not exist.'}</p>
        <Link
          href="/leads"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Leads
        </Link>
      </div>
    );
  }

  const style = stageStyles[lead.stage];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/leads"
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">
                {lead.firstName} {lead.lastName}
              </h1>
              <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${style.bg} ${style.text}`}>
                {style.icon} {lead.stage}
              </span>
            </div>
            <p className="text-gray-500 mt-1">{lead.company}</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto sm:justify-end">
          <Link
            href={`/leads/${lead._id}/edit`}
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            <Edit className="w-4 h-4" />
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <a href={`mailto:${lead.email}`} className="text-gray-900 hover:text-primary-600">
                    {lead.email}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <Phone className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-gray-900">{lead.phone || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Building className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Company</p>
                  <p className="text-gray-900">{lead.company}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-50 rounded-lg">
                  <Target className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Source</p>
                  <p className="text-gray-900">{lead.source}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Notes</h2>
            <p className="text-gray-600 whitespace-pre-wrap">
              {lead.notes || 'No notes available for this lead.'}
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Deal Value */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Deal Value</h2>
            <div className="text-3xl font-bold text-gray-900">
              ${lead.value.toLocaleString()}
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Probability</span>
                <span className="font-medium text-gray-900">{lead.probability}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all"
                  style={{ width: `${lead.probability}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Weighted Value: ${Math.round(lead.value * (lead.probability / 100)).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Details</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Created</p>
                  <p className="text-gray-900">{format(new Date(lead.createdAt), 'MMMM d, yyyy')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Last Updated</p>
                  <p className="text-gray-900">{format(new Date(lead.updatedAt), 'MMMM d, yyyy')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Assigned To</p>
                  <p className="text-gray-900">{lead.assignedTo}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <a
                href={`mailto:${lead.email}?subject=Follow-up&body=Hi ${lead.firstName},`}
                className="flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <Mail className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700">Send Email</span>
              </a>
              {lead.phone && (
                <a
                  href={`tel:${lead.phone}`}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <Phone className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700">Call Lead</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
