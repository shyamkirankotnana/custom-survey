import React from 'react';
import { AspectRating, RatingOption } from '../types/survey';
import { Check } from 'lucide-react';

interface AspectRatingCardsProps {
  ratings: Record<string, RatingOption>;
  onRatingChange: (id: string, value: RatingOption) => void;
}

export const aspectItems: AspectRating[] = [
  {
    id: 'accessibility',
    title: 'Accessibility',
    subtitle: '(Ability to establish contact with the RM whenever needed)',
    category: 'Card 1',
  },
  {
    id: 'frequency',
    title: 'Frequency / Regularity of proactively being in touch with you',
    category: 'Card 2',
  },
  {
    id: 'banking_knowledge',
    title: 'Knowledge about banking related products and services',
    category: 'Card 3',
  },
  {
    id: 'investment_knowledge',
    title: 'Knowledge about investment related products and services',
    category: 'Card 4',
  },
  {
    id: 'understanding_needs',
    title: 'Ability to understand your financial needs and service requirements',
    category: 'Card 5',
  },
  {
    id: 'resolution_quality',
    title: 'Quality of resolution provided',
    category: 'Card 6',
  },
  {
    id: 'service_timelines',
    title: 'Service delivery within committed timelines',
    category: 'Card 7',
  },
  {
    id: 'rm_etiquette',
    title: 'RM Etiquette',
    subtitle: '(Politeness, Grooming, Corporate Attire, etc.)',
    category: 'Card 8',
  },
];

export const AspectRatingCards: React.FC<AspectRatingCardsProps> = ({
  ratings,
  onRatingChange,
}) => {
  const options: Exclude<RatingOption, null>[] = [
    'Very Poor',
    'Poor',
    'Good',
    'Very Good',
  ];

  const completedCount = aspectItems.filter(item => ratings[item.id] !== undefined && ratings[item.id] !== null).length;

  return (
    <div className="mb-6 space-y-4">
      {/* Question 3 Section Title Card */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-2xl p-5 shadow-card relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
              Q3
            </span>
            <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
              Detailed Assessment
            </span>
          </div>
          <div className="bg-white/10 px-2.5 py-1 rounded-full text-[11px] font-bold text-gray-200 border border-white/10">
            {completedCount} / {aspectItems.length} Completed
          </div>
        </div>

        <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
          Please rate the Relationship Manager on the below aspects
        </h3>
        <p className="text-xs text-gray-300 mt-1">
          Select one performance level per aspect card below.
        </p>

        {/* Progress Bar inside section title */}
        <div className="w-full bg-gray-700 h-1.5 rounded-full mt-3 overflow-hidden">
          <div
            className="bg-primary h-full transition-all duration-300 rounded-full"
            style={{ width: `${(completedCount / aspectItems.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Individual Aspect Cards (NO TABLES USED) */}
      {aspectItems.map((aspect) => {
        const selectedValue = ratings[aspect.id] || null;

        return (
          <div
            key={aspect.id}
            className={`bg-white rounded-2xl p-4 sm:p-5 shadow-card border transition-all duration-200 hover:shadow-card-hover ${
              selectedValue ? 'border-primary/40 bg-red-50/10' : 'border-bankBorder'
            }`}
          >
            {/* Aspect Card Header */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <span className="text-[11px] font-extrabold text-primary uppercase tracking-wider block mb-0.5">
                  {aspect.category}
                </span>
                <h4 className="text-sm sm:text-base font-bold text-textPrimary leading-snug">
                  {aspect.title}
                </h4>
              </div>

              {selectedValue && (
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm animate-soft-pulse">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}
            </div>

            {aspect.subtitle && (
              <p className="text-xs text-textSecondary mb-3 italic font-medium">
                {aspect.subtitle}
              </p>
            )}

            {/* Options Row - STRICT SINGLE ROW HORIZONTAL SCROLL */}
            <div className="relative mt-3">
              <div className="flex flex-nowrap overflow-x-auto no-scrollbar gap-2 py-1 px-0.5 -mx-1 touch-pan-x horizontal-scroll-container">
                {options.map((opt) => {
                  const isSelected = selectedValue === opt;
                  
                  // Color accents depending on option status
                  let badgeColor = '';
                  if (isSelected) {
                    if (opt === 'Very Good' || opt === 'Good') {
                      badgeColor = 'bg-primary text-white border-primary shadow-brand';
                    } else {
                      badgeColor = 'bg-gray-800 text-white border-gray-800 shadow-md';
                    }
                  } else {
                    badgeColor = 'bg-white text-textPrimary border-bankBorder hover:border-primary/50 hover:bg-red-50/40';
                  }

                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => onRatingChange(aspect.id, opt)}
                      className={`min-h-[44px] px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 flex-shrink-0 border touch-manipulation active:scale-95 ${badgeColor}`}
                      aria-pressed={isSelected}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
