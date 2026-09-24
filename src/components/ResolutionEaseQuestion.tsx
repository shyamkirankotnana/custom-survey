import React from 'react';
import { EaseOption } from '../types/survey';
import { Check } from 'lucide-react';

interface ResolutionEaseQuestionProps {
  value: EaseOption;
  onChange: (option: EaseOption) => void;
}

export const ResolutionEaseQuestion: React.FC<ResolutionEaseQuestionProps> = ({
  value,
  onChange,
}) => {
  const options: Exclude<EaseOption, null>[] = [
    'Very Easy',
    'Easy',
    'Difficult',
    'Very Difficult',
  ];

  return (
    <div className="bg-white rounded-2xl p-5 shadow-card border border-bankBorder mb-4 transition-all hover:shadow-card-hover">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0">
          Q2
        </span>
        <span className="text-xs font-bold text-primary uppercase tracking-wider">
          Query Resolution
        </span>
      </div>

      <h3 className="text-sm sm:text-base font-bold text-textPrimary leading-snug mb-4">
        How easy was it for you to get a resolution from your Bank Relationship Manager for your query or transaction?
      </h3>

      {/* Pill Style Buttons Container - STRICT SINGLE ROW HORIZONTAL SCROLL */}
      <div className="relative">
        <div className="flex flex-nowrap overflow-x-auto no-scrollbar gap-2 py-1 px-0.5 -mx-1 touch-pan-x horizontal-scroll-container">
          {options.map((option) => {
            const isSelected = value === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => onChange(option)}
                className={`min-h-[44px] px-4 py-2.5 rounded-full font-bold text-xs sm:text-sm whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 flex-shrink-0 border touch-manipulation ${
                  isSelected
                    ? 'bg-primary text-white border-primary shadow-brand scale-[1.02]'
                    : 'bg-white text-textPrimary border-bankBorder hover:border-primary/50 hover:bg-red-50/40 active:scale-95'
                }`}
                aria-pressed={isSelected}
              >
                {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                {option}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
