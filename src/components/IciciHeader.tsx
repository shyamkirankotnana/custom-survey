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
  title = 'ICICI Bank RM Survey',
  progressPercentage,
}) => {
  return (
    <div className="flex flex-col flex-shrink-0 relative z-20 border-b border-orange-700">
      {/* ICICI Orange Header Bar */}
      <div className="bg-orange-600 text-white px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="w-8 h-8 flex items-center justify-start">
          {showBack && onBack && (
            <button
              type="button"
              onClick={onBack}
              className="w-7 h-7 rounded-full bg-orange-700 hover:bg-orange-800 active:scale-90 flex items-center justify-center text-white transition-all cursor-pointer border border-orange-500"
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

      {/* Orange Progress Bar Line */}
      {progressPercentage !== undefined && (
        <div className="w-full bg-orange-200 h-1 flex-shrink-0">
          <div
            className="bg-orange-500 h-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      )}
    </div>
  );
};
