import React from 'react';
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
  // Positive to Negative order
  const options: Exclude<RatingOption, null>[] = [
    'Very Good',
    'Good',
    'Poor',
    'Very Poor',
  ];



  // Option color grading based on label
  const optionColors: Record<
    string,
    {
      header: string;
      radio: string;
      rowBg: string;
      hoverBorder: string;
    }
  > = {
    'Very Good': {
      header: 'text-green-700',
      radio: 'border-green-600 bg-green-600',
      rowBg: 'bg-green-50/40',
      hoverBorder: 'group-hover:border-green-500',
    },
    'Good': {
      header: 'text-emerald-700',
      radio: 'border-emerald-500 bg-emerald-500',
      rowBg: 'bg-emerald-50/40',
      hoverBorder: 'group-hover:border-emerald-400',
    },
    'Poor': {
      header: 'text-orange-700',
      radio: 'border-orange-500 bg-orange-500',
      rowBg: 'bg-orange-50/40',
      hoverBorder: 'group-hover:border-orange-400',
    },
    'Very Poor': {
      header: 'text-red-700',
      radio: 'border-red-600 bg-red-600',
      rowBg: 'bg-red-50/40',
      hoverBorder: 'group-hover:border-red-500',
    },
  };

  const maxLength = 500;
  const minLength = 20;
  const isQ3Complete = aspectItems.length === Object.keys(ratings).length;
  const isQ4Valid = q4FeedbackText.length === 0 || q4FeedbackText.length >= minLength;
  const isValidToSubmit = isQ3Complete && isQ4Valid;

  return (
    <div className="flex-1 flex flex-col justify-between p-1.5 sm:p-3 bg-bankBg text-textPrimary overflow-hidden h-full">
      <div className="flex-1 flex flex-col min-h-0 space-y-2.5 overflow-y-auto no-scrollbar pb-2">
        {/* Q3 Section Title */}
        <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-card border border-bankBorder flex-shrink-0">
          <h2 className="text-sm sm:text-base font-bold text-textPrimary leading-snug">
            Please rate the Relationship Manager on the below aspects:
          </h2>
        </div>

        {/* Optimized Grid Table — Maximum text area on left, compact right-aligned radio option columns */}
        <div className="bg-white rounded-2xl shadow-card border border-bankBorder overflow-hidden flex-shrink-0">
          {/* Table Header with Color Graded Single-Line Option Titles (Never Wrapped) */}
          <div
            className="border-b-2 border-orange-200 bg-orange-50/90"
            style={{ display: 'grid', gridTemplateColumns: '1fr repeat(4, 48px)' }}
          >
            <div className="px-2 py-2 text-[11px] sm:text-xs font-extrabold text-textPrimary flex items-center uppercase tracking-wider whitespace-nowrap">
              Aspects
            </div>
            {options.map((opt) => {
              const colors = optionColors[opt];
              return (
                <div key={opt} className="py-2.5 px-0.5 flex items-center justify-center text-center overflow-hidden">
                  <span className={`text-[8.5px] sm:text-[9.5px] font-extrabold ${colors.header} leading-none whitespace-nowrap text-center`}>
                    {opt}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Table Rows with Color Graded Selections */}
          {aspectItems.map((item, idx) => {
            const selected = ratings[item.id] || null;
            const isEvenRow = idx % 2 === 0;
            const selectedColor = selected ? optionColors[selected] : null;

            return (
              <div
                key={item.id}
                className={`border-b border-gray-100 last:border-b-0 ${
                  selectedColor
                    ? selectedColor.rowBg
                    : isEvenRow
                    ? 'bg-white'
                    : 'bg-gray-50/50'
                } transition-colors`}
                style={{ display: 'grid', gridTemplateColumns: '1fr repeat(4, 48px)' }}
              >
                {/* Aspect Label — Max width so text fits in minimal lines */}
                <div className="px-2.5 py-2 flex items-center min-h-[42px]">
                  <span className="text-[11px] sm:text-xs text-textPrimary leading-snug font-medium">
                    {item.title}
                  </span>
                </div>

                {/* Radio Buttons — Label-based color grading */}
                {options.map((opt) => {
                  const isSelected = selected === opt;
                  const colors = optionColors[opt];

                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => onRatingSelect(item.id, opt)}
                      className="w-full h-full min-h-[42px] flex items-center justify-center cursor-pointer group focus:outline-none"
                      aria-label={`${item.title} - ${opt}`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center flex-shrink-0 ${
                          isSelected
                            ? `${colors.radio} shadow-sm scale-105`
                            : `border-gray-300 bg-white ${colors.hoverBorder} group-active:scale-95`
                        }`}
                      >
                        {isSelected && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Q4 — On same screen as Q3 */}
        <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-card border border-bankBorder flex-shrink-0">
          <h2 className="text-sm sm:text-base font-bold text-textPrimary leading-snug mb-2.5">
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

          {/* Same-line aligned middle: Warning text on left, character count on right */}
          <div className="flex items-center justify-between mt-2 px-1 text-[11px] min-h-[18px]">
            <div>
              {q4FeedbackText.length > 0 && q4FeedbackText.length < minLength && (
                <span className="text-red-500 font-medium">Minimum {minLength} characters required</span>
              )}
            </div>
            <span
              className={`font-semibold ${
                q4FeedbackText.length > 0 && q4FeedbackText.length < minLength ? 'text-red-500' : 'text-textSecondary'
              }`}
            >
              {q4FeedbackText.length} / {maxLength}
            </span>
          </div>
        </div>
      </div>

      {/* Orange CTA Button */}
      <div className="pt-2 pb-2 bg-bankBg flex justify-center flex-shrink-0 z-20 border-t border-gray-200/40">
        <button
          type="button"
          onClick={onFinish}
          disabled={!isValidToSubmit}
          className={`w-48 h-11 rounded-full font-extrabold text-sm flex items-center justify-center gap-2 shadow-brand transition-all cursor-pointer ${
            isValidToSubmit
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

