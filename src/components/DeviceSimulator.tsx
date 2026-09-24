import React from 'react';
import { DeviceWidth } from '../types/survey';
import { Wifi, Battery, Signal } from 'lucide-react';

interface DeviceSimulatorProps {
  deviceWidth: DeviceWidth;
  children: React.ReactNode;
}

export const DeviceSimulator: React.FC<DeviceSimulatorProps> = ({
  deviceWidth,
  children,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-slate-900 py-6 px-2 flex flex-col items-center justify-start transition-all">
      {/* Device Outer Frame */}
      <div
        className="w-full bg-bankBg rounded-[40px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] border-[10px] border-gray-900 overflow-hidden transition-all duration-300 relative flex flex-col"
        style={{ maxWidth: deviceWidth, minHeight: '844px' }}
      >
        {/* Mobile Top Notch & Status Bar */}
        <div className="bg-white px-6 pt-3 pb-1 flex items-center justify-between text-[12px] font-extrabold text-gray-900 border-b border-gray-100 flex-shrink-0 select-none">
          <span>9:41</span>
          {/* Dynamic Speaker Notch */}
          <div className="w-24 h-4 bg-gray-900 rounded-full flex items-center justify-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-gray-800 border border-gray-700" />
            <div className="w-8 h-1 bg-gray-800 rounded-full" />
          </div>
          <div className="flex items-center gap-1.5 text-gray-700">
            <Signal className="w-3.5 h-3.5 fill-current" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4" />
          </div>
        </div>

        {/* Inner Content Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col">
          {children}
        </div>

        {/* Mobile Bottom Home Indicator */}
        <div className="bg-white py-2 flex items-center justify-center flex-shrink-0 select-none border-t border-gray-100">
          <div className="w-32 h-1 bg-gray-300 rounded-full" />
        </div>
      </div>
    </div>
  );
};
