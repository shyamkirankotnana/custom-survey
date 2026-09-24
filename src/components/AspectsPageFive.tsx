import React from 'react';
import { RatingOption } from '../types/survey';
import { ArrowRight } from 'lucide-react';

interface AspectsPageFiveProps {
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

export const AspectsPageFive: React.FC<AspectsPageFiveProps> = ({
  ratings,
  onRatingSelect,
  onFinish,
}) => {
  // Bad to Good Order
  const options: Exclude<RatingOption, null>[] = [
    'Very Poor',
    'Poor',
    'Good',
    'Very Good',
  ];

  return (
    <div className="flex-1 flex flex-col justify-between p-1.5 sm:p-3 bg-bankBg text-textPrimary">
      <div className="space-y-2.5">
        {/* Section Title */}
        <div className="bg-white rounded-xl p-2.5 shadow-card border border-bankBorder">
          <h2 className="text-xs sm:text-sm font-bold text-textPrimary leading-snug">
            3. Please rate the Relationship Manager on the below aspects:
          </h2>
        </div>

        {/* Aspect Cards List */}
        <div className="space-y-2.5">
          {aspectItems.map((item, idx) => {
            const selected = ratings[item.id] || null;

            return (
              <div
                key={item.id}
                className={`bg-white rounded-xl p-2.5 shadow-sm border transition-all ${
                  selected ? 'border-emerald-500/40 bg-emerald-50/10' : 'border-bankBorder'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h3 className="text-xs font-bold text-textPrimary leading-snug">
                    <span className="text-emerald-700 font-extrabold mr-1">{idx + 1}.</span>
                    {item.title}
                  </h3>
                </div>

                {item.subtitle && (
                  <p className="text-[11px] text-textSecondary italic mb-2 font-medium">
                    {item.subtitle}
                  </p>
                )}

                {/* Rating Buttons Row - Bad to Good, Uniform Clean Styling, No Border Touching */}
                <div className="grid grid-cols-4 gap-1 w-full mt-1.5">
                  {options.map((opt) => {
                    const isSelected = selected === opt;

                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => onRatingSelect(item.id, opt)}
                        style={{ fontSize: 'clamp(7.5px, 2.3vw, 11.5px)' }}
                        className={`h-8 min-[360px]:h-9 px-0.5 rounded-lg flex items-center justify-center transition-all border whitespace-nowrap leading-none cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-sm scale-[1.02]'
                            : 'bg-white text-gray-800 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
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

      {/* Dark Emerald Green Primary Action Button (Next) */}
      <div className="mt-5 pt-2 sticky bottom-0 bg-bankBg/95 backdrop-blur-sm pb-1">
        <button
          type="button"
          onClick={onFinish}
          className="w-full h-12 rounded-xl bg-emerald-600 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-brand hover:bg-emerald-700 active:scale-[0.98] transition-all cursor-pointer"
        >
          <span>Next</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
