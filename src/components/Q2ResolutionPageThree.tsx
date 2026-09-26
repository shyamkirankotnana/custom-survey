import React from 'react';
import { EaseOption } from '../types/survey';
import { ArrowRight } from 'lucide-react';

interface Q2ResolutionPageThreeProps {
  value: EaseOption;
  onChange: (option: EaseOption) => void;
  q2FollowUpText: string;
  onQ2FollowUpChange: (text: string) => void;
  onNext: () => void;
}

export const Q2ResolutionPageThree: React.FC<Q2ResolutionPageThreeProps> = ({
  value,
  onChange,
  q2FollowUpText,
  onQ2FollowUpChange,
  onNext,
}) => {
  // Positive to Negative order (Very Easy -> Very Difficult)
  const options: Exclude<EaseOption, null>[] = [
    'Very Easy',
    'Easy',
    'Difficult',
    'Very Difficult',
  ];

  const maxLength = 500;
  const minLength = 20;
  const isDifficult = value === 'Difficult' || value === 'Very Difficult';
  const isFollowUpValid = q2FollowUpText.length >= minLength;

  // Color mapping for options based on label (Very Easy = Green, Easy = Emerald, Difficult = Orange, Very Difficult = Red)
  const getOptionColor = (opt: string) => {
    switch (opt) {
      case 'Very Easy':
        return 'bg-green-600 text-white border-green-600 shadow-md scale-[1.02] font-extrabold';
      case 'Easy':
        return 'bg-emerald-500 text-white border-emerald-500 shadow-md scale-[1.02] font-extrabold';
      case 'Difficult':
        return 'bg-orange-500 text-white border-orange-500 shadow-md scale-[1.02] font-extrabold';
      case 'Very Difficult':
        return 'bg-red-600 text-white border-red-600 shadow-md scale-[1.02] font-extrabold';
      default:
        return 'bg-orange-500 text-white border-orange-500 shadow-md scale-[1.02] font-extrabold';
    }
  };

  return (
    <div className="p-3 sm:p-4 bg-bankBg text-textPrimary flex flex-col items-center w-full">
      <div className="w-full max-w-md space-y-3">
        {/* CES Question Card */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-card border border-bankBorder">
          <h2 className="text-sm sm:text-base font-bold text-textPrimary leading-snug mb-4">
            How easy was it for you to get a resolution from your ICICI Bank Relationship Manager for your query / transaction?
          </h2>

          {/* Option Pills — Positive to Negative with label-based color grading */}
          <div className="grid grid-cols-4 gap-1 w-full my-2">
            {options.map((opt) => {
              const isSelected = value === opt;

              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => onChange(opt)}
                  style={{ fontSize: 'clamp(8px, 2.4vw, 12px)' }}
                  className={`h-10 sm:h-11 px-0.5 rounded-xl font-medium transition-all border whitespace-nowrap leading-none flex items-center justify-center cursor-pointer ${
                    isSelected
                      ? getOptionColor(opt)
                      : 'bg-white text-gray-800 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                >
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Inline Follow-up for Difficult/Very Difficult (same screen) */}
        {isDifficult && (
          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-card border border-bankBorder">
            <h2 className="text-sm sm:text-base font-bold text-textPrimary leading-snug mb-3">
              What could have made the recent interaction with your ICICI Bank Relationship Manager easier? Could you please explain with an example?
            </h2>

            <textarea
              rows={3}
              maxLength={maxLength}
              value={q2FollowUpText}
              onChange={(e) => onQ2FollowUpChange(e.target.value)}
              placeholder="Please enter your response here"
              className="w-full p-3 bg-gray-50/80 border border-gray-300 rounded-xl text-sm text-textPrimary placeholder:text-gray-400 placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all resize-none font-sans"
            />

            {/* Same-line aligned middle: Warning text on left, character count on right */}
            <div className="flex items-center justify-between mt-2 px-1 text-[11px] min-h-[18px]">
              <div>
                {q2FollowUpText.length < minLength && (
                  <span className="text-red-500 font-medium">Minimum {minLength} characters required</span>
                )}
              </div>
              <span
                className={`font-semibold ${
                  q2FollowUpText.length < minLength ? 'text-red-500' : 'text-textSecondary'
                }`}
              >
                {q2FollowUpText.length} / {maxLength}
              </span>
            </div>
          </div>
        )}

        {/* Orange CTA Button */}
        <div className="pt-2 flex justify-center w-full">
          <button
            type="button"
            onClick={onNext}
            disabled={value === null || (isDifficult && !isFollowUpValid)}
            className={`w-44 h-11 rounded-full font-extrabold text-sm flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-md ${
              value !== null && (!isDifficult || isFollowUpValid)
                ? 'bg-orange-500 text-white hover:bg-orange-600 active:scale-[0.98]'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
            }`}
          >
            <span>Next</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};
