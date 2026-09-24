import React from 'react';
import { MessageSquareText } from 'lucide-react';

interface FollowUpTextareaProps {
  value: string;
  onChange: (val: string) => void;
}

export const FollowUpTextarea: React.FC<FollowUpTextareaProps> = ({
  value,
  onChange,
}) => {
  const maxLength = 500;
  const remaining = maxLength - value.length;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-card border border-bankBorder mb-4 transition-all hover:shadow-card-hover">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0">
          Q2A
        </span>
        <span className="text-xs font-bold text-primary uppercase tracking-wider">
          Feedback Details
        </span>
      </div>

      <h3 className="text-sm sm:text-base font-bold text-textPrimary leading-snug mb-3">
        What could have made the recent interaction with your Bank Relationship Manager easier? Could you please explain with an example?
      </h3>

      <div className="relative">
        <textarea
          rows={3}
          maxLength={maxLength}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g. Quicker response time on phone calls, clearer documentation checklist before branch visit..."
          className="w-full p-3.5 bg-gray-50/70 border border-bankBorder rounded-xl text-sm text-textPrimary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all resize-none font-sans"
        />

        <div className="flex items-center justify-between mt-2 px-1 text-xs">
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
  );
};
