import React, { useState } from 'react';
import { BarChart3, Clock, Calendar as CalendarIcon } from 'lucide-react';
import { DailyDelayRecord } from '../types';
import { DayPicker } from 'react-day-picker';
import { format, isValid, parseISO } from 'date-fns';
import 'react-day-picker/dist/style.css';

interface DelayHistoryProps {
  history: DailyDelayRecord[];
}

const DelayHistory: React.FC<DelayHistoryProps> = ({ history }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return format(date, 'EEE, d MMM');
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const sortedHistory = [...history].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const maxDelay = Math.max(1, ...history.map(h => h.totalDelayMinutes));

  // Get the dates that have records
  const hasRecordDays = history.map(record => parseISO(record.date));

  // Get selected day's record
  const selectedDayRecord = selectedDate 
    ? history.find(record => record.date === format(selectedDate, 'yyyy-MM-dd'))
    : null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Delay History</h2>
          <p className="text-gray-600">View historical service disruptions</p>
        </div>
        <div className="relative">
          <button
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <CalendarIcon className="w-4 h-4" />
            {selectedDate ? format(selectedDate, 'dd MMM yyyy') : 'Select Date'}
          </button>
          
          {isCalendarOpen && (
            <div className="absolute right-0 top-12 z-10 bg-white rounded-lg shadow-xl border border-gray-200 p-2">
              <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date);
                  setIsCalendarOpen(false);
                }}
                disabled={[
                  { before: hasRecordDays[0], after: hasRecordDays[hasRecordDays.length - 1] }
                ]}
                modifiers={{
                  hasRecord: hasRecordDays
                }}
                modifiersStyles={{
                  hasRecord: { 
                    fontWeight: 'bold',
                    color: '#2563eb'
                  }
                }}
              />
            </div>
          )}
        </div>
      </div>

      {selectedDayRecord ? (
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            {format(parseISO(selectedDayRecord.date), 'EEEE, d MMMM yyyy')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-3">
              <p className="text-sm text-gray-600">Total Delays</p>
              <p className="text-xl font-bold text-blue-600">
                {formatTime(selectedDayRecord.totalDelayMinutes)}
              </p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <p className="text-sm text-gray-600">Affected Lines</p>
              <p className="text-xl font-bold text-amber-600">
                {selectedDayRecord.affectedLines} lines
              </p>
            </div>
            {selectedDayRecord.worstLine && (
              <div className="bg-white rounded-lg p-3">
                <p className="text-sm text-gray-600">Most Delayed Line</p>
                <p className="text-xl font-bold text-red-600">
                  {selectedDayRecord.worstLine.name}
                </p>
                <p className="text-sm text-red-500">
                  {formatTime(selectedDayRecord.worstLine.delayMinutes)} delay
                </p>
              </div>
            )}
          </div>
        </div>
      ) : null}

      <div className="space-y-4">
        {sortedHistory.map((record) => {
          const percentage = (record.totalDelayMinutes / maxDelay) * 100;
          const opacity = 0.7 + (percentage / 100) * 0.3;
          const isSelected = selectedDate && record.date === format(selectedDate, 'yyyy-MM-dd');
          
          return (
            <div 
              key={record.date} 
              className={`relative p-3 rounded-lg transition-colors ${
                isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-600">
                  {formatDate(record.date)}
                </span>
                <span className="text-sm font-semibold text-gray-800">
                  {formatTime(record.totalDelayMinutes)}
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${Math.max(0, Math.min(100, percentage))}%`,
                    opacity: Math.max(0, Math.min(1, opacity))
                  }}
                />
              </div>
              <div className="mt-1 flex justify-between text-xs text-gray-500">
                <span>{record.affectedLines} lines affected</span>
                {record.worstLine && (
                  <span className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {record.worstLine.name}: {formatTime(record.worstLine.delayMinutes)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DelayHistory;