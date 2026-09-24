import React from 'react';
import { EaseOption } from '../types/survey';
import { ArrowRight } from 'lucide-react';

interface Q2ResolutionPageThreeProps {
  value: EaseOption;
  onChange: (option: EaseOption) => void;
  onNext: () => void;
}

export const Q2ResolutionPageThree: React.FC<Q2ResolutionPageThreeProps> = ({
  value,
  onChange,
  onNext,
}) => {
  // Bad to Good Order (As requested by user & screenshot)
  const options: Exclude<EaseOption, null>[] = [
    'Very Difficult',
    'Difficult',
    'Easy',
    'Very Easy',
  ];

  return (
    <div className="flex-1 flex flex-col justify-between p-3 sm:p-4 bg-bankBg text-textPrimary">
      <div className="space-y-4">
        {/* Question 2 Card */}
        <div className="bg-white rounded-2xl p-2.5 sm:p-4 shadow-card border border-bankBorder">
          <h2 className="text-xs sm:text-sm font-bold text-textPrimary leading-snug mb-3">
            Q2. How easy was it for you to get a resolution from your Bank Relationship Manager for your query / transaction?
          </h2>

          {/* Option Pills - Bad to Good Order, Uniform Styling, Fluid Font Scaling */}
          <div className="grid grid-cols-4 gap-1 w-full my-2">
            {options.map((opt) => {
              const isSelected = value === opt;

              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => onChange(opt)}
                  style={{ fontSize: 'clamp(7.5px, 2.3vw, 11.5px)' }}
                  className={`h-9 sm:h-10 px-0.5 rounded-xl font-medium transition-all border whitespace-nowrap leading-none flex items-center justify-center cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md scale-[1.02] font-extrabold'
                      : 'bg-white text-gray-800 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                >
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dark Emerald Green Primary Action Button (Next) */}
      <div className="mt-6 pt-2">
        <button
          type="button"
          onClick={onNext}
          disabled={value === null}
          className={`w-full h-12 rounded-xl font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-md ${
            value !== null
              ? 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.98]'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
          }`}
        >
          <span>Next</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
