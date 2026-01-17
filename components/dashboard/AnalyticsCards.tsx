'use client';

import { useEffect, useState } from 'react';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Target,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { AnalyticsMetrics } from '@/lib/types';

export default function AnalyticsCards() {
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const response = await fetch('/api/analytics');
        if (response.ok) {
          const data = await response.json();
          setMetrics(data);
        }
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Leads',
      value: metrics?.totalLeads || 0,
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%',
      positive: true,
    },
    {
      title: 'Pipeline Value',
      value: `$${(metrics?.totalValue || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-emerald-500',
      change: '+8%',
      positive: true,
    },
    {
      title: 'Converted',
      value: metrics?.convertedLeads || 0,
      icon: Target,
      color: 'bg-purple-500',
      change: `${metrics?.conversionRate.toFixed(1) || 0}%`,
      positive: true,
      subtitle: 'Conversion Rate',
    },
    {
      title: 'Avg Deal Size',
      value: `$${(metrics?.averageDealSize || 0).toLocaleString()}`,
      icon: TrendingUp,
      color: 'bg-orange-500',
      change: '+5%',
      positive: true,
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`${card.color} p-3 rounded-lg`}>
              <card.icon className="w-5 h-5 text-white" />
            </div>
            {card.change && (
              <div className={`flex items-center gap-1 text-sm font-medium ${
                card.positive ? 'text-green-600' : 'text-red-600'
              }`}>
                {card.positive ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                {card.change}
              </div>
            )}
          </div>
          <p className="text-sm text-gray-500 font-medium">{card.title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
          {card.subtitle && (
            <p className="text-xs text-gray-400 mt-1">{card.subtitle}</p>
          )}
        </div>
      ))}
    </div>
  );
}
