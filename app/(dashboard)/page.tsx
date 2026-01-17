import { Suspense } from 'react';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Target,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import AnalyticsCards from '@/components/dashboard/AnalyticsCards';
import LeadsChart from '@/components/dashboard/LeadsChart';
import SourceChart from '@/components/dashboard/SourceChart';
import RecentLeads from '@/components/dashboard/RecentLeads';

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Overview of your sales pipeline and performance</p>
        </div>
        <a
          href="/leads"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
        >
          <Users className="w-4 h-4" />
          View All Leads
        </a>
      </div>

      {/* Analytics Cards */}
      <Suspense fallback={<LoadingSkeleton />}>
        <AnalyticsCards />
      </Suspense>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Suspense fallback={<div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-80 animate-pulse"><div className="h-full bg-gray-200 rounded"></div></div>}>
          <LeadsChart />
        </Suspense>
        <Suspense fallback={<div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-80 animate-pulse"><div className="h-full bg-gray-200 rounded"></div></div>}>
          <SourceChart />
        </Suspense>
      </div>

      {/* Recent Leads */}
      <Suspense fallback={<div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-80 animate-pulse"><div className="h-full bg-gray-200 rounded"></div></div>}>
        <RecentLeads />
      </Suspense>
    </div>
  );
}
