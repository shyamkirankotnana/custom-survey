import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface Q4FeedbackPageSixProps {
  value: string;
  onChange: (text: string) => void;
  onFinish: () => void;
}

export const Q4FeedbackPageSix: React.FC<Q4FeedbackPageSixProps> = ({
  value,
  onChange,
  onFinish,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const maxLength = 500;

  const showPlaceholder = !isFocused && value.length === 0;

  return (
    <div className="p-3 sm:p-4 bg-bankBg text-textPrimary flex flex-col items-center w-full">
      <div className="w-full max-w-md space-y-4">
        {/* Question Card */}
        <div className="bg-white rounded-2xl p-3.5 sm:p-4 shadow-card border border-bankBorder">
          <h2 className="text-xs sm:text-sm font-bold text-textPrimary leading-snug">
            Q4. Is there any other feedback related to your Relationship Manager that you want to share?
          </h2>
        </div>

        {/* Textarea Input Container */}
        <div className="bg-white rounded-xl p-3.5 shadow-card border border-bankBorder relative space-y-2">
          <div className="relative">
            <textarea
              id="q4-feedback-input"
              value={value}
              onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              rows={3}
              className="w-full text-xs text-textPrimary bg-transparent border-0 focus:outline-none focus:ring-0 resize-none leading-relaxed p-1"
            />

            {/* Disappearing Grey Prompt Placeholder */}
            {showPlaceholder && (
              <div
                onClick={() => {
                  setIsFocused(true);
                  document.getElementById('q4-feedback-input')?.focus();
                }}
                className="absolute inset-0 p-1 pointer-events-none text-xs text-gray-400 font-normal leading-relaxed italic select-none"
              >
                Share your feedback or suggestions here...
              </div>
            )}
          </div>

          <div className="flex justify-end items-center pt-2 border-t border-gray-100 text-[11px] text-textSecondary font-medium">
            <span
              className={
                value.length > 450 ? 'text-amber-600 font-bold' : 'text-gray-400'
              }
            >
              {value.length} / {maxLength}
            </span>
          </div>
        </div>

        {/* CTA Button with Consistent Right Arrow (Positioned Directly Below Card) */}
        <div className="pt-2 flex justify-center w-full">
          <button
            type="button"
            onClick={onFinish}
            className="w-48 h-11 bg-emerald-600 text-white font-extrabold text-sm rounded-full flex items-center justify-center gap-2 shadow-brand hover:bg-emerald-700 transition-all active:scale-95 cursor-pointer"
          >
            <span>Finish & Submit</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};
