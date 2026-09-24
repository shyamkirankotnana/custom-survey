import React from 'react';
import { ChevronLeft } from 'lucide-react';

interface IciciHeaderProps {
  onBack?: () => void;
  showBack?: boolean;
  title?: string;
  progressPercentage?: number;
}

export const IciciHeader: React.FC<IciciHeaderProps> = ({
  onBack,
  showBack = true,
  title = 'Feedback',
  progressPercentage,
}) => {
  return (
    <div className="flex flex-col flex-shrink-0 relative z-20 border-b border-gray-800">
      {/* Black & White Enterprise Header Bar */}
      <div className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="w-8 h-8 flex items-center justify-start">
          {showBack && onBack && (
            <button
              type="button"
              onClick={onBack}
              className="w-7 h-7 rounded-full bg-gray-800 hover:bg-gray-700 active:scale-90 flex items-center justify-center text-white transition-all cursor-pointer border border-gray-700"
              aria-label="Go Back"
            >
              <ChevronLeft className="w-4.5 h-4.5 stroke-[2.5]" />
            </button>
          )}
        </div>

        <h1 className="text-base font-bold tracking-tight text-white text-center flex-1">
          {title}
        </h1>

        <div className="w-8 h-8" />
      </div>

      {/* Dark Emerald Green Progress Bar Line */}
      {progressPercentage !== undefined && (
        <div className="w-full bg-gray-800 h-1 flex-shrink-0">
          <div
            className="bg-emerald-500 h-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      )}
    </div>
  );
};
