import React from 'react';
import { Award, Zap, ShieldCheck, Star } from 'lucide-react';
import { ReputationStats } from '../types';

interface ReputationBadgeProps {
  stats: ReputationStats;
  compact?: boolean;
}

export const ReputationBadge: React.FC<ReputationBadgeProps> = ({ stats, compact = false }) => {
  const tierConfig = {
    Elite: { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', icon: Star, label: 'Elite Responder' },
    Consistent: { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', icon: ShieldCheck, label: 'Consistent' },
    Responsive: { color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', icon: Zap, label: 'Responsive' },
    New: { color: 'text-gray-500', bg: 'bg-gray-50', border: 'border-gray-200', icon: Award, label: 'Rising Recruiter' },
  };

  const config = tierConfig[stats.tier];
  const Icon = config.icon;

  if (compact) {
    return (
      <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border ${config.bg} ${config.border} ${config.color} text-[10px] font-bold uppercase tracking-wider`}>
        <Icon size={12} />
        {config.label}
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-xl border ${config.bg} ${config.border} relative overflow-hidden group`}>
      <div className="absolute -right-2 -bottom-2 opacity-5 transform rotate-12 group-hover:scale-110 transition-transform">
        <Icon size={80} />
      </div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${config.color} bg-white shadow-sm`}>
              <Icon size={20} />
            </div>
            <div>
              <p className={`text-xs font-bold uppercase tracking-widest ${config.color}`}>{config.label}</p>
              <h4 className="text-sm font-bold text-gray-900">Company Trust Score</h4>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-gray-900 leading-none">{Math.round(stats.responseRate)}%</p>
            <p className="text-[10px] text-gray-500 font-bold uppercase">Response Rate</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100/50">
          <div>
            <p className="text-[10px] text-gray-500 font-bold uppercase">Avg. Feedback</p>
            <p className="text-sm font-bold text-gray-900">
              {stats.avgResponseTimeDays < 1 ? '< 24 Hours' : `~${Math.round(stats.avgResponseTimeDays)} Days`}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-gray-500 font-bold uppercase">Total Closure</p>
            <p className="text-sm font-bold text-gray-900">{stats.totalResponded} Candidates</p>
          </div>
        </div>
      </div>
    </div>
  );
};