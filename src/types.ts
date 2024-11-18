export interface LineStatus {
  id: string;
  name: string;
  status: string;
  reason: string;
  statusSeverity: number;
  statusSeverityDescription: string;
  delayMinutes: number;
}

export interface ServiceStatus {
  loading: boolean;
  error?: string;
  data?: LineStatus[];
}

export interface DelayStats {
  totalDelayMinutes: number;
  affectedLines: number;
  worstLine?: {
    name: string;
    delayMinutes: number;
  };
}

export interface DailyDelayRecord {
  date: string;
  totalDelayMinutes: number;
  affectedLines: number;
  worstLine?: {
    name: string;
    delayMinutes: number;
  };
  timestamp: number;
}