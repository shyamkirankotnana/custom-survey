import React from 'react';
import { NpsScore } from '../types/survey';
import { ArrowRight } from 'lucide-react';

interface NpsPageOneProps {
  npsScore: NpsScore;
  onScoreSelect: (score: number) => void;
  q1FollowUpText: string;
  onQ1FollowUpChange: (text: string) => void;
  onNext: () => void;
}

export const NpsPageOne: React.FC<NpsPageOneProps> = ({
  npsScore,
  onScoreSelect,
  q1FollowUpText,
  onQ1FollowUpChange,
  onNext,
}) => {
  const scores = Array.from({ length: 11 }, (_, i) => i);
  const maxLength = 500;
  const minLength = 20;

  // NPS Color mapping: 0-6 = Red, 7-8 = Orange, 9-10 = Green
  const getNpsColor = (score: number) => {
    if (score <= 6) return { bg: 'bg-red-600', border: 'border-red-600' };
    if (score <= 8) return { bg: 'bg-orange-500', border: 'border-orange-500' };
    return { bg: 'bg-green-600', border: 'border-green-600' };
  };

  const isDetractorOrPassive = npsScore !== null && npsScore <= 8;

  const followUpQuestion = isDetractorOrPassive
    ? 'How can the Relationship Manager improve his/her services to make you give a rating of 10?'
    : 'What did you specifically like about the services provided by ICICI Bank\'s Relationship Manager?';

  const isFollowUpValid = q1FollowUpText.length >= minLength;

  return (
    <div className="p-3 sm:p-4 bg-bankBg text-textPrimary flex flex-col items-center w-full">
      <div className="w-full max-w-md space-y-3">
        {/* NPS Question Card */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-card border border-bankBorder">
          <h2 className="text-sm sm:text-base font-bold text-textPrimary leading-snug mb-4">
            Based on the recent interaction you had with your Relationship Manager, how likely are you to recommend ICICI Bank to a friend, relative or colleague?
          </h2>

          {/* 0 to 10 Scale Buttons Grid with NPS Color Coding */}
          <div className="grid grid-cols-11 gap-0.5 sm:gap-1.5 w-full my-2">
            {scores.map((score) => {
              const isSelected = npsScore === score;
              const colors = getNpsColor(score);

              return (
                <button
                  key={score}
                  type="button"
                  onClick={() => onScoreSelect(score)}
                  style={{ fontSize: 'clamp(9px, 3.0vw, 15px)' }}
                  className={`aspect-square w-full rounded-md font-medium flex items-center justify-center p-0 leading-none transition-all duration-150 cursor-pointer border ${
                    isSelected
                      ? `${colors.bg} text-white ${colors.border} shadow-md font-bold scale-[1.04] z-10`
                      : 'bg-white text-gray-800 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                  aria-label={`Score ${score}`}
                >
                  <span className={score === 10 ? 'tracking-tighter' : ''}>{score}</span>
                </button>
              );
            })}
          </div>

          {/* Bottom Labels — positioned at edges near 0 and 10 */}
          <div className="flex items-start justify-between mt-3 text-[11px] sm:text-xs font-semibold text-textSecondary px-0.5">
            <span className="text-left leading-tight text-gray-500 max-w-[100px]">
              Will not at all recommend
            </span>
            <span className="text-right leading-tight text-gray-500 max-w-[100px]">
              Will definitely recommend
            </span>
          </div>
        </div>

        {/* Inline Follow-up Question (appears on same screen after NPS selection) */}
        {npsScore !== null && (
          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-card border border-bankBorder">
            <h2 className="text-sm sm:text-base font-bold text-textPrimary leading-snug mb-3">
              {followUpQuestion}
            </h2>

            <textarea
              rows={3}
              maxLength={maxLength}
              value={q1FollowUpText}
              onChange={(e) => onQ1FollowUpChange(e.target.value)}
              placeholder="Please enter your response here"
              className="w-full p-3 bg-gray-50/80 border border-gray-300 rounded-xl text-sm text-textPrimary placeholder:text-gray-400 placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all resize-none font-sans"
            />

            {/* Same-line aligned middle: Warning text on left, character count on right */}
            <div className="flex items-center justify-between mt-2 px-1 text-[11px] min-h-[18px]">
              <div>
                {q1FollowUpText.length < minLength && (
                  <span className="text-red-500 font-medium">Minimum {minLength} characters required</span>
                )}
              </div>
              <span
                className={`font-semibold ${
                  q1FollowUpText.length < minLength ? 'text-red-500' : 'text-textSecondary'
                }`}
              >
                {q1FollowUpText.length} / {maxLength}
              </span>
            </div>
          </div>
        )}

        {/* Orange CTA Button */}
        <div className="pt-2 flex justify-center w-full">
          <button
            type="button"
            onClick={onNext}
            disabled={npsScore === null || !isFollowUpValid}
            className={`w-44 h-11 rounded-full font-extrabold text-sm flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-md ${
              npsScore !== null && isFollowUpValid
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
