import React from 'react';
import { DeviceWidth } from '../types/survey';

interface DeviceSimulatorProps {
  deviceWidth: DeviceWidth;
  children: React.ReactNode;
}

export const DeviceSimulator: React.FC<DeviceSimulatorProps> = ({
  deviceWidth,
  children,
}) => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start py-0 sm:py-4 px-0 sm:px-2">
      <div
        className="w-full bg-bankBg min-h-screen sm:min-h-[720px] sm:rounded-2xl sm:shadow-lg sm:border sm:border-gray-200 overflow-hidden flex flex-col transition-all duration-300"
        style={{ maxWidth: deviceWidth }}
      >
        <div className="flex-1 flex flex-col min-h-0 relative">
          {children}
        </div>
      </div>
    </div>
  );
};
