import React from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import Header from './components/Header';
import StatusCard from './components/StatusCard';
import DelaySummary from './components/DelaySummary';
import DelayHistory from './components/DelayHistory';
import { useTransportStatus } from './hooks/useTransportStatus';
import { useDelayHistory } from './hooks/useDelayHistory';

function App() {
  const { data, loading, error, delayStats } = useTransportStatus();
  const delayHistory = useDelayHistory(delayStats);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-3 text-lg text-gray-600">Loading status updates...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-3" />
            <h2 className="text-lg font-semibold text-red-700 mb-2">Error Loading Status</h2>
            <p className="text-red-600">{error}</p>
          </div>
        ) : (
          <>
            {delayStats && <DelaySummary stats={delayStats} />}
            
            {delayHistory.length > 0 && <DelayHistory history={delayHistory} />}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data?.map((line) => (
                <StatusCard
                  key={line.id}
                  name={line.name}
                  status={line.status}
                  reason={line.reason}
                  severity={line.statusSeverity}
                />
              ))}
            </div>
            
            <p className="text-center text-gray-500 text-sm mt-8">
              Data provided by Transport for London
            </p>
          </>
        )}
      </main>
    </div>
  );
}

export default App;