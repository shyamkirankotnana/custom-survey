import React from 'react';
import { Send, Lock, AlertCircle } from 'lucide-react';

interface SubmitFooterProps {
  completedQuestions: number;
  totalQuestions: number;
  onSubmit: () => void;
  isValid: boolean;
}

export const SubmitFooter: React.FC<SubmitFooterProps> = ({
  completedQuestions,
  totalQuestions,
  onSubmit,
  isValid,
}) => {
  const percentage = Math.round((completedQuestions / totalQuestions) * 100);

  return (
    <div className="sticky bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-bankBorder p-4 shadow-floating z-20 transition-all">
      <div className="max-w-md mx-auto space-y-2.5">
        {/* Completion Progress Bar */}
        <div className="flex items-center justify-between text-xs font-semibold text-textSecondary">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>Survey Progress</span>
          </div>
          <span className="text-primary font-bold">{completedQuestions} of {totalQuestions} answered ({percentage}%)</span>
        </div>

        <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-primary h-full transition-all duration-500 ease-out rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {!isValid && (
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-amber-700 bg-amber-50 py-1.5 px-3 rounded-lg font-medium border border-amber-200">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
            <span>Please complete the NPS rating & query resolution question to submit.</span>
          </div>
        )}

        {/* Action Button */}
        <button
          type="button"
          onClick={onSubmit}
          className={`w-full min-h-[50px] rounded-xl font-extrabold text-base flex items-center justify-center gap-2 transition-all duration-200 shadow-brand cursor-pointer touch-manipulation active:scale-[0.98] ${
            isValid
              ? 'bg-primary text-white hover:bg-primary-hover shadow-lg'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
          }`}
        >
          <span>Submit Customer Feedback</span>
          <Send className="w-4 h-4 stroke-[2.5]" />
        </button>

        {/* High Trust Micro Footer */}
        <div className="flex items-center justify-center gap-1 text-[11px] text-textSecondary font-medium">
          <Lock className="w-3 h-3 text-gray-400" />
          <span>Protected by 256-Bit Bank Level Encryption</span>
        </div>
      </div>
    </div>
  );
};
