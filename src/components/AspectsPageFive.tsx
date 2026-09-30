import React from 'react';
import { RatingOption } from '../types/survey';
import { ArrowRight, Loader2 } from 'lucide-react';

interface AspectsPageFiveProps {
  ratings: Record<string, RatingOption>;
  onRatingSelect: (id: string, option: RatingOption) => void;
  q4FeedbackText: string;
  onQ4FeedbackChange: (text: string) => void;
  onFinish: () => void;
  isSubmitting?: boolean;
  submitError?: string | null;
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
  isSubmitting = false,
  submitError = null,
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
  const isQ3Complete = aspectItems.length === Object.keys(ratings).length;

  return (
    <div className="flex-1 flex flex-col justify-between px-1.5 sm:px-3 pt-1 sm:pt-2 bg-bankBg text-textPrimary h-full overflow-hidden">
      <div className="flex-1 flex flex-col min-h-0 space-y-3 overflow-y-auto no-scrollbar pb-2 relative">
        {/* Q3 Section Title — Positioned below sticky header z-index layer so it slides underneath on scroll */}
        <div className="bg-white rounded-2xl p-3.5 sm:p-4 shadow-card border border-bankBorder flex-shrink-0 relative z-10">
          <h2 className="text-base sm:text-lg font-bold text-textPrimary leading-snug">
            Please rate the Relationship Manager on the below aspects:
          </h2>
        </div>

        {/* Sticky Header + Rows Wrapper — Header sticks at top-0 below progress bar */}
        <div className="relative z-20">
          {/* Sticky Table Header — Freezes at top of scroll area while questions & rows pass through underneath */}
          <div
            className="sticky top-0 z-30 border-b-2 border-orange-200 bg-orange-50 shadow-md rounded-t-2xl"
            style={{ display: 'grid', gridTemplateColumns: '1fr repeat(4, 44px)' }}
          >
            <div className="px-3 py-2.5 text-xs sm:text-sm font-extrabold text-textPrimary flex items-center uppercase tracking-wider">
              Aspects
            </div>
            {options.map((opt) => {
              const colors = optionColors[opt];
              return (
                <div key={opt} className="py-2.5 px-0.5 flex items-center justify-center text-center">
                  <span className={`text-[12px] sm:text-[15px] font-black ${colors.header} leading-[1.05] whitespace-normal text-center tracking-tight max-w-[44px]`}>
                    {opt}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Aspect Rows Card — All 8 rows at full natural height, no internal scroll */}
          <div className="bg-white rounded-b-2xl shadow-card border border-bankBorder border-t-0 overflow-hidden">
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
                  } transition-colors ${idx === aspectItems.length - 1 ? 'rounded-b-2xl' : ''}`}
                  style={{ display: 'grid', gridTemplateColumns: '1fr repeat(4, 44px)' }}
                >
                  {/* Aspect Label — Expanded width space & increased font size */}
                  <div className="px-3 py-3 flex items-center min-h-[48px]">
                    <span className="text-sm sm:text-base text-gray-900 leading-snug font-bold">
                      {item.title}
                    </span>
                  </div>

                  {/* Radio Buttons — Positioned closer together */}
                  {options.map((opt) => {
                    const isSelected = selected === opt;
                    const colors = optionColors[opt];

                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => onRatingSelect(item.id, opt)}
                        className="w-full h-full min-h-[48px] flex items-center justify-center cursor-pointer group focus:outline-none"
                        aria-label={`${item.title} - ${opt}`}
                      >
                        <div
                          className={`w-[22px] h-[22px] rounded-full border-2 transition-all flex items-center justify-center flex-shrink-0 ${
                            isSelected
                              ? `${colors.radio} shadow-sm scale-105`
                              : `border-gray-300 bg-white ${colors.hoverBorder} group-active:scale-95`
                          }`}
                        >
                          {isSelected && (
                            <div className="w-2 h-2 rounded-full bg-white" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        {/* Q4 — Appears ONLY after all 8 aspects of Q3 have been rated */}
        {isQ3Complete && (
          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-card border border-bankBorder flex-shrink-0 animate-fade-in">
            <h2 className="text-base sm:text-lg font-bold text-textPrimary leading-snug mb-3">
              Is there any other feedback related to your Relationship Manager that you want to share?
            </h2>

            <textarea
              rows={3}
              maxLength={maxLength}
              value={q4FeedbackText}
              onChange={(e) => onQ4FeedbackChange(e.target.value)}
              placeholder="Please enter your response here"
              className="w-full p-3 bg-gray-50/80 border border-gray-300 rounded-xl text-sm sm:text-base text-textPrimary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all resize-none font-sans"
            />

            {/* Q4 Footer — No minimum character requirement */}
            <div className="flex items-center justify-end mt-2 px-1 text-xs">
              <span className="font-semibold text-textSecondary">
                {q4FeedbackText.length} / {maxLength}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Orange CTA Button — "Submit" */}
      <div className="pt-2 pb-2 bg-bankBg flex flex-col items-center justify-center flex-shrink-0 z-20 border-t border-gray-200/40">
        {submitError && (
          <div className="mb-2 px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600 font-semibold text-center max-w-xs">
            {submitError}
          </div>
        )}
        <button
          type="button"
          onClick={onFinish}
          disabled={!isQ3Complete || isSubmitting}
          className={`w-48 h-12 rounded-full font-extrabold text-base flex items-center justify-center gap-2 shadow-brand transition-all cursor-pointer ${
            isQ3Complete && !isSubmitting
              ? 'bg-orange-500 text-white hover:bg-orange-600 active:scale-[0.98]'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <span>Submit</span>
              <ArrowRight className="w-4.5 h-4.5 stroke-[2.5]" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

