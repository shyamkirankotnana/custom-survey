import React from 'react';
import { ArrowRight, MessageSquareText } from 'lucide-react';

interface Q2FollowUpPageFourProps {
  value: string;
  onChange: (text: string) => void;
  onNext: () => void;
}

export const Q2FollowUpPageFour: React.FC<Q2FollowUpPageFourProps> = ({
  value,
  onChange,
  onNext,
}) => {
  const maxLength = 500;
  const remaining = maxLength - value.length;

  return (
    <div className="flex-1 flex flex-col justify-between p-3 sm:p-4 bg-bankBg text-textPrimary">
      <div className="space-y-4">
        {/* Single Question Card */}
        <div className="bg-white rounded-2xl p-3.5 sm:p-4 shadow-card border border-bankBorder">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-[11px] font-extrabold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              Resolution Improvement
            </span>
          </div>

          <h2 className="text-xs sm:text-sm font-bold text-textPrimary leading-snug mb-3">
            Q2a. What could have made the recent interaction with your Bank Relationship Manager easier? Could you please explain with an example?
          </h2>

          <div className="relative">
            <textarea
              rows={4}
              maxLength={maxLength}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="e.g. Clearer documentation checklist before branch visit, quicker turn-around time for loan query resolution..."
              className="w-full p-3 bg-gray-50/80 border border-gray-300 rounded-xl text-xs sm:text-sm text-textPrimary placeholder:text-gray-400 placeholder:text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white transition-all resize-none font-sans"
            />

            <div className="flex items-center justify-between mt-2 px-1">
              <div className="flex items-center gap-1 text-textSecondary text-[11px]">
                <MessageSquareText className="w-3.5 h-3.5 text-gray-400" />
                <span>Optional response</span>
              </div>
              <span
                className={`font-semibold text-[11px] ${
                  remaining < 50 ? 'text-amber-600' : 'text-textSecondary'
                }`}
              >
                {value.length} / {maxLength}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Dark Emerald Green Primary Action Button (Next) */}
      <div className="mt-6 pt-2">
        <button
          type="button"
          onClick={onNext}
          className="w-full h-12 rounded-xl bg-emerald-600 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-brand hover:bg-emerald-700 active:scale-[0.98] transition-all cursor-pointer"
        >
          <span>Next</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
