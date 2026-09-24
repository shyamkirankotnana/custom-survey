import React from 'react';
import { NpsScore } from '../types/survey';
import { ArrowRight } from 'lucide-react';

interface NpsPageOneProps {
  npsScore: NpsScore;
  onScoreSelect: (score: number) => void;
  onNext: () => void;
}

export const NpsPageOne: React.FC<NpsPageOneProps> = ({
  npsScore,
  onScoreSelect,
  onNext,
}) => {
  const scores = Array.from({ length: 11 }, (_, i) => i);

  // Dynamic Sentiment Emoji
  const getSentimentEmoji = (score: NpsScore) => {
    if (score === null) return '😐';
    if (score <= 6) return '😟';
    if (score <= 8) return '😐';
    if (score === 9) return '🙂';
    return '😃';
  };

  // Subtle Persuasive Color Grading Helper for Unselected Options (Bad to Good)
  const getSubtleOptionStyle = (score: number) => {
    if (score <= 6) {
      return 'bg-white text-gray-800 border-gray-300 hover:border-emerald-400/50 hover:bg-gray-50';
    }
    if (score <= 8) {
      return 'bg-amber-50/20 text-gray-900 border-amber-200/80 hover:border-emerald-400 hover:bg-amber-50/50';
    }
    if (score === 9) {
      return 'bg-emerald-50/30 text-emerald-950 border-emerald-300/80 hover:bg-emerald-50/70 hover:border-emerald-500 font-medium';
    }
    // Score 10 - Subtle Persuasive Highlight Tint
    return 'bg-emerald-50/50 text-emerald-950 border-emerald-400 hover:bg-emerald-100/80 hover:border-emerald-600 font-semibold ring-1 ring-emerald-300/40';
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-1.5 sm:p-3 bg-bankBg text-textPrimary">
      <div className="space-y-4">
        {/* Question 1 Prompt */}
        <div className="bg-white rounded-2xl p-2 sm:p-4 shadow-card border border-bankBorder">
          <h2 className="text-xs min-[360px]:text-sm sm:text-base font-bold text-textPrimary leading-snug mb-3.5">
            1. Based on the recent interaction you had with your Relationship Manager, how likely are you to recommend the Bank to a friend, relative or colleague?
          </h2>

          {/* 0 to 10 Scale Buttons Grid with Persuasive Color Grading (Bad to Good) */}
          <div className="grid grid-cols-11 gap-0.5 sm:gap-1.5 w-full my-2">
            {scores.map((score) => {
              const isSelected = npsScore === score;
              const unselectedStyle = getSubtleOptionStyle(score);

              return (
                <button
                  key={score}
                  type="button"
                  onClick={() => onScoreSelect(score)}
                  style={{ fontSize: 'clamp(8.5px, 3.0vw, 14.5px)' }}
                  className={`aspect-square w-full rounded-md font-normal flex items-center justify-center p-0 leading-none transition-all duration-150 cursor-pointer border ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md font-bold scale-[1.04] z-10'
                      : unselectedStyle
                  }`}
                  aria-label={`Score ${score}`}
                >
                  <span className={score === 10 ? 'tracking-tighter' : ''}>{score}</span>
                </button>
              );
            })}
          </div>

          {/* Bottom Labels and Emoji */}
          <div className="flex items-center justify-between mt-4 text-[11px] sm:text-xs font-semibold text-textSecondary px-0.5">
            <span className="w-1/3 text-left leading-tight text-gray-600">
              Will not at all recommend
            </span>

            <div className="w-1/3 flex justify-center">
              <span className="text-3xl transition-transform transform hover:scale-110 drop-shadow-sm select-none">
                {getSentimentEmoji(npsScore)}
              </span>
            </div>

            <span className="w-1/3 text-right leading-tight text-emerald-700 font-bold">
              Will definitely recommend
            </span>
          </div>
        </div>
      </div>

      {/* Dark Emerald Green Primary CTA Button */}
      <div className="mt-6 pt-2">
        <button
          type="button"
          onClick={onNext}
          disabled={npsScore === null}
          className={`w-full h-12 sm:h-13 rounded-xl font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-md ${
            npsScore !== null
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
