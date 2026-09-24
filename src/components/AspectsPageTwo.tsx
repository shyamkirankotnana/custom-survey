import React from 'react';
import { RatingOption } from '../types/survey';
import { Check, CheckCircle2 } from 'lucide-react';

interface AspectsPageTwoProps {
  ratings: Record<string, RatingOption>;
  onRatingSelect: (id: string, option: RatingOption) => void;
  onFinish: () => void;
}

export const aspectItems = [
  {
    id: 'accessibility',
    title: 'Accessibility',
    subtitle: '(Ability to establish contact with the RM whenever needed)',
  },
  {
    id: 'frequency',
    title: 'Frequency / Regularity of proactively being in touch',
  },
  {
    id: 'banking_knowledge',
    title: 'Knowledge about banking related products & services',
  },
  {
    id: 'investment_knowledge',
    title: 'Knowledge about investment related products & services',
  },
  {
    id: 'understanding_needs',
    title: 'Ability to understand your financial needs & service requirements',
  },
  {
    id: 'resolution_quality',
    title: 'Quality of resolution provided',
  },
  {
    id: 'service_timelines',
    title: 'Service delivery within committed timelines',
  },
  {
    id: 'rm_etiquette',
    title: 'RM Etiquette',
    subtitle: '(Politeness, Grooming, Corporate Attire, etc.)',
  },
];

export const AspectsPageTwo: React.FC<AspectsPageTwoProps> = ({
  ratings,
  onRatingSelect,
  onFinish,
}) => {
  const options: Exclude<RatingOption, null>[] = [
    'Very Poor',
    'Poor',
    'Good',
    'Very Good',
  ];

  const completedCount = aspectItems.filter(
    (item) => ratings[item.id] !== undefined && ratings[item.id] !== null
  ).length;

  return (
    <div className="flex-1 flex flex-col justify-between p-1.5 sm:p-3 bg-bankBg text-textPrimary">
      <div className="space-y-2.5">
        {/* Section Title */}
        <div className="bg-white rounded-xl p-2.5 shadow-card border border-bankBorder flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-textPrimary">
              2. Please rate the Relationship Manager on the below aspects:
            </h2>
            <p className="text-[11px] text-textSecondary font-medium">
              Select one rating per aspect below
            </p>
          </div>
          <div className="px-2.5 py-1 rounded-full bg-red-50 text-primary text-xs font-extrabold border border-red-100 flex-shrink-0">
            {completedCount}/{aspectItems.length} Rated
          </div>
        </div>

        {/* Aspect Cards List - NO SCROLLBARS, FIT TO SCREEN */}
        <div className="space-y-2.5">
          {aspectItems.map((item, idx) => {
            const selected = ratings[item.id] || null;

            return (
              <div
                key={item.id}
                className={`bg-white rounded-xl p-3 shadow-sm border transition-all ${
                  selected ? 'border-primary/40 bg-red-50/10' : 'border-bankBorder'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-xs font-bold text-textPrimary leading-snug">
                    <span className="text-primary font-extrabold mr-1">{idx + 1}.</span>
                    {item.title}
                  </h3>
                  {selected && (
                    <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3] flex-shrink-0 mt-0.5" />
                  )}
                </div>

                {item.subtitle && (
                  <p className="text-[11px] text-textSecondary italic mb-2 font-medium">
                    {item.subtitle}
                  </p>
                )}

                {/* Rating Buttons Row - FIT 100% WIDTH ZERO SCROLL & NO TEXT WRAP */}
                <div className="grid grid-cols-4 gap-1 w-full mt-1.5">
                  {options.map((opt) => {
                    const isSelected = selected === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => onRatingSelect(item.id, opt)}
                        className={`h-9 px-0.5 rounded-lg text-[10px] sm:text-xs font-bold flex items-center justify-center transition-all border whitespace-nowrap ${
                          isSelected
                            ? 'bg-primary text-white border-primary font-extrabold shadow-sm scale-[1.02]'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-primary/40 active:scale-95'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Primary Action Button (Finish) */}
      <div className="mt-5 pt-2 sticky bottom-0 bg-bankBg/95 backdrop-blur-sm pb-1">
        <button
          type="button"
          onClick={onFinish}
          className="w-full h-12 rounded-xl bg-primary text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-brand hover:bg-primary-hover active:scale-[0.98] transition-all cursor-pointer"
        >
          <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
          <span>Finish & Submit</span>
        </button>
      </div>
    </div>
  );
};
