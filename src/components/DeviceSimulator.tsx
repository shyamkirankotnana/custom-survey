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
    <div className="min-h-screen min-h-[100dvh] bg-bankBg sm:bg-gray-100 flex flex-col items-center justify-start py-0 sm:py-4 px-0 sm:px-2 w-full">
      <div
        className="w-full max-w-full sm:max-w-[var(--dev-width)] bg-bankBg min-h-screen min-h-[100dvh] sm:min-h-[720px] sm:rounded-2xl sm:shadow-lg sm:border sm:border-gray-200 overflow-hidden flex flex-col transition-all duration-300"
        style={{ '--dev-width': deviceWidth } as React.CSSProperties}
      >
        <div className="flex-1 flex flex-col min-h-0 relative w-full">
          {children}
        </div>
      </div>
    </div>
  );
};
