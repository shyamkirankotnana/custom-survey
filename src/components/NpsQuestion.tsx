import React from 'react';
import { NpsScore } from '../types/survey';

interface NpsQuestionProps {
  value: NpsScore;
  onChange: (score: number) => void;
}

export const NpsQuestion: React.FC<NpsQuestionProps> = ({ value, onChange }) => {
  const scores = Array.from({ length: 11 }, (_, i) => i);

  // Sentiment Helper
  const getSentimentText = (score: NpsScore) => {
    if (score === null) return null;
    if (score <= 6) return { emoji: '😞', label: 'Detractor', color: 'text-rose-600 bg-rose-50 border-rose-200' };
    if (score <= 8) return { emoji: '😐', label: 'Passive', color: 'text-amber-600 bg-amber-50 border-amber-200' };
    if (score === 9) return { emoji: '🙂', label: 'Promoter', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
    return { emoji: '😃', label: 'Highly Satisfied', color: 'text-emerald-700 bg-emerald-100 border-emerald-300' };
  };

  const sentiment = getSentimentText(value);

  return (
    <div className="bg-white rounded-2xl p-5 shadow-card border border-bankBorder mb-4 transition-all hover:shadow-card-hover">
      {/* Question Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0">
            Q1
          </span>
          <span className="text-xs font-bold text-primary uppercase tracking-wider">
            NPS Rating
          </span>
        </div>
        {sentiment && (
          <div className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 transition-all animate-soft-pulse ${sentiment.color}`}>
            <span className="text-sm leading-none">{sentiment.emoji}</span>
            <span>Score {value} • {sentiment.label}</span>
          </div>
        )}
      </div>

      <h3 className="text-sm sm:text-base font-bold text-textPrimary leading-snug mb-4">
        Based on the recent interaction you had with your Relationship Manager, how likely are you to recommend the Bank to a friend, relative or colleague?
      </h3>

      {/* Visual Sentiment Indicators Display */}
      <div className="flex items-center justify-between bg-gray-50 p-2 rounded-xl mb-4 border border-gray-100 text-center text-xs text-textSecondary">
        <div className={`flex flex-col items-center p-1 rounded-lg transition-all ${value !== null && value <= 6 ? 'bg-rose-100 scale-105 font-bold text-rose-700' : 'opacity-70'}`}>
          <span className="text-xl">😞</span>
          <span className="text-[10px] mt-0.5">0 - 6</span>
        </div>
        <div className={`flex flex-col items-center p-1 rounded-lg transition-all ${value !== null && value >= 7 && value <= 8 ? 'bg-amber-100 scale-105 font-bold text-amber-700' : 'opacity-70'}`}>
          <span className="text-xl">😐</span>
          <span className="text-[10px] mt-0.5">7 - 8</span>
        </div>
        <div className={`flex flex-col items-center p-1 rounded-lg transition-all ${value === 9 ? 'bg-emerald-100 scale-105 font-bold text-emerald-700' : 'opacity-70'}`}>
          <span className="text-xl">🙂</span>
          <span className="text-[10px] mt-0.5">9</span>
        </div>
        <div className={`flex flex-col items-center p-1 rounded-lg transition-all ${value === 10 ? 'bg-emerald-200 scale-105 font-bold text-emerald-800' : 'opacity-70'}`}>
          <span className="text-xl">😃</span>
          <span className="text-[10px] mt-0.5">10</span>
        </div>
      </div>

      {/* NPS Scale Buttons Container - STRICT SINGLE ROW HORIZONTAL SCROLL */}
      <div className="relative">
        <div className="flex flex-nowrap overflow-x-auto no-scrollbar gap-1.5 py-1.5 px-0.5 -mx-1 touch-pan-x horizontal-scroll-container">
          {scores.map((score) => {
            const isSelected = value === score;
            return (
              <button
                key={score}
                type="button"
                onClick={() => onChange(score)}
                className={`flex-1 min-w-[44px] h-[48px] rounded-xl font-extrabold text-sm sm:text-base flex items-center justify-center transition-all duration-200 cursor-pointer flex-shrink-0 touch-manipulation border ${
                  isSelected
                    ? 'bg-primary text-white border-primary shadow-brand scale-[1.03] z-10'
                    : 'bg-white text-textPrimary border-bankBorder hover:border-primary/50 hover:bg-red-50/40 active:scale-95'
                }`}
                aria-label={`Rate ${score} out of 10`}
              >
                {score}
              </button>
            );
          })}
        </div>
      </div>

      {/* NPS Scale Labels */}
      <div className="flex items-center justify-between text-[11px] font-semibold text-textSecondary mt-2 px-1">
        <span className="text-rose-600 flex items-center gap-1">
          <span>←</span> Will not recommend
        </span>
        <span className="text-emerald-600 flex items-center gap-1">
          Will definitely recommend <span>→</span>
        </span>
      </div>
    </div>
  );
};
