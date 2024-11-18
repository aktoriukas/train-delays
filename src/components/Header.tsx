import React from 'react';
import { Train } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-6 px-4 shadow-lg">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Train className="w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold">London Transport Status</h1>
            <p className="text-blue-100">Real-time updates for tubes and trains</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-blue-100">Last updated:</p>
          <time className="text-lg font-semibold">
            {new Date().toLocaleTimeString('en-GB')}
          </time>
        </div>
      </div>
    </header>
  );
};

export default Header;