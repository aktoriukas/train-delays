import { useState, useEffect, useCallback } from 'react';
import { DailyDelayRecord, DelayStats } from '../types';

const STORAGE_KEY = 'transport-delay-history';
const MAX_HISTORY_DAYS = 7;

export const useDelayHistory = (currentStats: DelayStats | undefined) => {
  const [history, setHistory] = useState<DailyDelayRecord[]>([]);

  // Load history from localStorage only once on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading history:', error);
    }
  }, []); // Empty dependency array ensures this runs only once

  // Memoize the update function to prevent unnecessary re-renders
  const updateHistory = useCallback((currentHistory: DailyDelayRecord[], stats: DelayStats) => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];

    // Remove entries older than MAX_HISTORY_DAYS
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - MAX_HISTORY_DAYS);

    // Filter out old records and today's previous records
    const filteredHistory = currentHistory.filter(record => {
      const recordDate = new Date(record.timestamp);
      return recordDate > cutoffDate && record.date !== today;
    });

    // Add new record
    const newRecord: DailyDelayRecord = {
      date: today,
      totalDelayMinutes: stats.totalDelayMinutes,
      affectedLines: stats.affectedLines,
      worstLine: stats.worstLine,
      timestamp: now.getTime()
    };

    return [...filteredHistory, newRecord];
  }, []);

  // Update history with new data
  useEffect(() => {
    if (!currentStats) return;

    try {
      const updatedHistory = updateHistory(history, currentStats);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
      setHistory(updatedHistory);
    } catch (error) {
      console.error('Error saving history:', error);
    }
  }, [currentStats, updateHistory]); // Remove history from dependencies

  return history;
};