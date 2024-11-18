import React from 'react';
import { Clock, AlertTriangle, TrendingUp } from 'lucide-react';
import { DelayStats } from '../types';

interface DelaySummaryProps {
  stats: DelayStats;
}

const DelaySummary: React.FC<DelaySummaryProps> = ({ stats }) => {
  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-blue-800 font-semibold">Total Delays Today</h3>
          <Clock className="w-5 h-5 text-blue-500" />
        </div>
        <p className="text-2xl font-bold text-blue-900">{formatTime(stats.totalDelayMinutes)}</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-amber-800 font-semibold">Affected Lines</h3>
          <AlertTriangle className="w-5 h-5 text-amber-500" />
        </div>
        <p className="text-2xl font-bold text-amber-900">{stats.affectedLines} lines</p>
      </div>

      {stats.worstLine && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-red-800 font-semibold">Most Delayed Line</h3>
            <TrendingUp className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-red-900">{stats.worstLine.name}</p>
          <p className="text-sm text-red-700">Delayed by {formatTime(stats.worstLine.delayMinutes)}</p>
        </div>
      )}
    </div>
  );
};

export default DelaySummary;