import React from 'react';
import { Smartphone, Check } from 'lucide-react';
import { DeviceWidth } from '../types/survey';

interface HeaderBannerProps {
  currentDeviceWidth: DeviceWidth;
  setDeviceWidth: (width: DeviceWidth) => void;
}

export const HeaderBanner: React.FC<HeaderBannerProps> = ({
  currentDeviceWidth,
  setDeviceWidth,
}) => {
  const devices: { label: string; width: DeviceWidth }[] = [
    { label: '320px', width: '320px' },
    { label: '360px', width: '360px' },
    { label: '375px', width: '375px' },
    { label: '390px', width: '390px' },
    { label: '414px', width: '414px' },
  ];

  return (
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-30 shadow-sm">
      <div className="max-w-2xl mx-auto text-white px-1.5 py-1.5 flex flex-col items-center justify-center gap-1">
        {/* Top Line: Centered "Screen Size" Label */}
        <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-gray-300">
          <Smartphone className="w-3 h-3 text-emerald-500" />
          <span>Screen Size</span>
        </div>

        {/* Bottom Line: Size Selection Buttons */}
        <div className="w-full flex items-center justify-center gap-0.5 min-[360px]:gap-1 flex-nowrap overflow-x-auto no-scrollbar py-0.5 px-0.5">
          {devices.map((device) => (
            <button
              key={device.width}
              onClick={() => setDeviceWidth(device.width)}
              className={`px-1.5 py-0.5 rounded text-[9.5px] min-[360px]:text-[11px] font-bold transition-all flex items-center gap-0.5 whitespace-nowrap cursor-pointer flex-shrink-0 ${
                currentDeviceWidth === device.width
                  ? 'bg-emerald-600 text-white shadow-sm font-extrabold'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {currentDeviceWidth === device.width && <Check className="w-2.5 h-2.5 stroke-[3]" />}
              {device.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
