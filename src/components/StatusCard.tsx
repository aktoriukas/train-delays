import React from 'react';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';

interface StatusCardProps {
  name: string;
  status: string;
  reason?: string;
  severity: number;
}

const StatusCard: React.FC<StatusCardProps> = ({ name, status, reason, severity }) => {
  const getStatusColor = (severity: number) => {
    if (severity <= 5) return 'bg-red-100 border-red-500 text-red-700';
    if (severity <= 8) return 'bg-yellow-100 border-yellow-500 text-yellow-700';
    return 'bg-green-100 border-green-500 text-green-700';
  };

  const getStatusIcon = (severity: number) => {
    if (severity <= 5) return <AlertCircle className="w-5 h-5 text-red-500" />;
    if (severity <= 8) return <Clock className="w-5 h-5 text-yellow-500" />;
    return <CheckCircle2 className="w-5 h-5 text-green-500" />;
  };

  return (
    <div className={`p-4 rounded-lg border ${getStatusColor(severity)} transition-all duration-300 hover:shadow-lg`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">{name}</h3>
        {getStatusIcon(severity)}
      </div>
      <p className="font-medium mb-1">{status}</p>
      {reason && <p className="text-sm opacity-75">{reason}</p>}
    </div>
  );
};

export default StatusCard;