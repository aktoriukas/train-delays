import useSWR from 'swr';
import { useState, useEffect, useMemo } from 'react';
import { LineStatus, DelayStats } from '../types';

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch transport status');
  return response.json();
};

const estimateDelayMinutes = (severity: number, description: string): number => {
  if (severity >= 9) return 0;
  if (description.toLowerCase().includes('severe')) return 30;
  if (description.toLowerCase().includes('minor')) return 10;
  if (description.toLowerCase().includes('part')) return 15;
  return severity <= 5 ? 25 : severity <= 8 ? 15 : 0;
};

const transformData = (data: any[]): LineStatus[] => {
  return data.map(line => {
    const status = line.lineStatuses[0]?.statusSeverityDescription || 'Good Service';
    const severity = line.lineStatuses[0]?.statusSeverity || 10;
    
    return {
      id: line.id,
      name: line.name,
      status,
      reason: line.lineStatuses[0]?.reason || '',
      statusSeverity: severity,
      statusSeverityDescription: status,
      delayMinutes: estimateDelayMinutes(severity, status)
    };
  });
};

const calculateDelayStats = (lines: LineStatus[]): DelayStats => {
  const delayedLines = lines.filter(line => line.delayMinutes > 0);
  const totalDelayMinutes = delayedLines.reduce((sum, line) => sum + line.delayMinutes, 0);
  
  const worstLine = delayedLines.length > 0 
    ? delayedLines.reduce((worst, current) => 
        current.delayMinutes > worst.delayMinutes ? current : worst
      )
    : undefined;

  return {
    totalDelayMinutes,
    affectedLines: delayedLines.length,
    worstLine: worstLine ? {
      name: worstLine.name,
      delayMinutes: worstLine.delayMinutes
    } : undefined
  };
};

export const useTransportStatus = () => {
  const { data: rawData, error, isLoading } = useSWR(
    'https://api.tfl.gov.uk/Line/Mode/tube,overground,dlr,elizabeth-line,national-rail/Status',
    fetcher,
    {
      refreshInterval: 30000,
      revalidateOnFocus: true
    }
  );

  // Memoize transformed data to prevent unnecessary recalculations
  const transformedData = useMemo(() => 
    rawData ? transformData(rawData) : undefined,
    [rawData]
  );

  // Memoize delay stats to prevent unnecessary recalculations
  const delayStats = useMemo(() => 
    transformedData ? calculateDelayStats(transformedData) : undefined,
    [transformedData]
  );

  return {
    data: transformedData,
    loading: isLoading,
    error: error?.message,
    delayStats
  };
};