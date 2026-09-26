import React, { useState } from 'react';
import { RatingOption } from '../types/survey';
import { ArrowRight } from 'lucide-react';

interface AspectsPageFiveProps {
  ratings: Record<string, RatingOption>;
  onRatingSelect: (id: string, option: RatingOption) => void;
  q4FeedbackText: string;
  onQ4FeedbackChange: (text: string) => void;
  onFinish: () => void;
}

export const aspectItems = [
  {
    id: 'accessibility',
    title: 'Accessibility i.e being able to establish contact with the RM whenever needed',
  },
  {
    id: 'frequency',
    title: 'Frequency/ regularity of proactively being in touch with you',
  },
  {
    id: 'banking_knowledge',
    title: 'Knowledge about various banking related products and services',
  },
  {
    id: 'investment_knowledge',
    title: 'Knowledge about various investment related products and services',
  },
  {
    id: 'understanding_needs',
    title: 'Ability to understand your financial needs/ service requirements',
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
    title: 'RM etiquette (Politeness, grooming, corporate attire etc.)',
  },
];

export const AspectsPageFive: React.FC<AspectsPageFiveProps> = ({
  ratings,
  onRatingSelect,
  q4FeedbackText,
  onQ4FeedbackChange,
  onFinish,
}) => {
  // Positive to Negative order (reversed per client feedback)
  const options: Exclude<RatingOption, null>[] = [
    'Very Good',
    'Good',
    'Poor',
    'Very Poor',
  ];

  const maxLength = 500;
  const minLength = 20;
  const isQ4Valid = q4FeedbackText.length === 0 || q4FeedbackText.length >= minLength;

  return (
    <div className="flex-1 flex flex-col justify-between p-1.5 sm:p-3 bg-bankBg text-textPrimary overflow-hidden h-full">
      <div className="flex-1 flex flex-col min-h-0 space-y-2.5 overflow-y-auto no-scrollbar pb-2">
        {/* Q3 Section Title */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-card border border-bankBorder flex-shrink-0">
          <h2 className="text-sm sm:text-base font-bold text-textPrimary leading-snug">
            Please rate the Relationship Manager on the below aspects:
          </h2>
        </div>

        {/* Grid Table Layout */}
        <div className="bg-white rounded-2xl shadow-card border border-bankBorder overflow-hidden flex-shrink-0">
          {/* Table Header */}
          <div className="grid grid-cols-[1fr_repeat(4,_minmax(0,_1fr))] border-b border-gray-200 bg-orange-50">
            <div className="p-2 sm:p-3 text-xs sm:text-sm font-bold text-textPrimary flex items-center">
              Aspects
            </div>
            {options.map((opt) => (
              <div key={opt} className="p-1.5 sm:p-2 text-center flex items-center justify-center">
                <span className="text-[9px] sm:text-[11px] font-bold text-orange-700 whitespace-nowrap leading-tight">
                  {opt}
                </span>
              </div>
            ))}
          </div>

          {/* Table Rows */}
          {aspectItems.map((item, idx) => {
            const selected = ratings[item.id] || null;
            const isEvenRow = idx % 2 === 0;

            return (
              <div
                key={item.id}
                className={`grid grid-cols-[1fr_repeat(4,_minmax(0,_1fr))] border-b border-gray-100 last:border-b-0 ${
                  isEvenRow ? 'bg-white' : 'bg-gray-50/50'
                }`}
              >
                {/* Aspect Label (LHS) */}
                <div className="p-2 sm:p-3 flex items-center">
                  <span className="text-[11px] sm:text-xs text-textPrimary leading-snug font-medium">
                    {item.title}
                  </span>
                </div>

                {/* Radio Buttons (RHS) */}
                {options.map((opt) => {
                  const isSelected = selected === opt;
                  return (
                    <div key={opt} className="p-1.5 flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => onRatingSelect(item.id, opt)}
                        className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 transition-all cursor-pointer flex items-center justify-center ${
                          isSelected
                            ? 'border-orange-500 bg-orange-500'
                            : 'border-gray-300 bg-white hover:border-orange-300'
                        }`}
                        aria-label={`${item.title} - ${opt}`}
                      >
                        {isSelected && (
                          <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-white" />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Q4 — On same screen as Q3 */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-card border border-bankBorder flex-shrink-0">
          <h2 className="text-sm sm:text-base font-bold text-textPrimary leading-snug mb-3">
            Is there any other feedback related to your Relationship Manager that you want to share?
          </h2>

          <textarea
            rows={3}
            maxLength={maxLength}
            value={q4FeedbackText}
            onChange={(e) => onQ4FeedbackChange(e.target.value)}
            placeholder="Please enter your response here"
            className="w-full p-3 bg-gray-50/80 border border-gray-300 rounded-xl text-sm text-textPrimary placeholder:text-gray-400 placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all resize-none font-sans"
          />

          <div className="flex items-center justify-end mt-2 px-1">
            <span
              className={`font-semibold text-[11px] ${
                q4FeedbackText.length > 0 && q4FeedbackText.length < minLength ? 'text-red-500' : 'text-textSecondary'
              }`}
            >
              {q4FeedbackText.length} / {maxLength}
            </span>
          </div>
          {q4FeedbackText.length > 0 && q4FeedbackText.length < minLength && (
            <p className="text-[11px] text-red-500 mt-1 px-1">Minimum {minLength} characters required</p>
          )}
        </div>
      </div>

      {/* Orange CTA Button */}
      <div className="pt-2 pb-2 bg-bankBg flex justify-center flex-shrink-0 z-20 border-t border-gray-200/40">
        <button
          type="button"
          onClick={onFinish}
          disabled={!isQ4Valid}
          className={`w-48 h-11 rounded-full font-extrabold text-sm flex items-center justify-center gap-2 shadow-brand transition-all cursor-pointer ${
            isQ4Valid
              ? 'bg-orange-500 text-white hover:bg-orange-600 active:scale-[0.98]'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
          }`}
        >
          <span>Finish & Submit</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
