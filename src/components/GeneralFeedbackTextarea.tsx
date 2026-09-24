import React from 'react';
import { Edit3 } from 'lucide-react';

interface GeneralFeedbackTextareaProps {
  value: string;
  onChange: (val: string) => void;
}

export const GeneralFeedbackTextarea: React.FC<GeneralFeedbackTextareaProps> = ({
  value,
  onChange,
}) => {
  const maxLength = 500;
  const remaining = maxLength - value.length;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-card border border-bankBorder mb-6 transition-all hover:shadow-card-hover">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0">
          Q4
        </span>
        <span className="text-xs font-bold text-primary uppercase tracking-wider">
          Additional Comments
        </span>
      </div>

      <h3 className="text-sm sm:text-base font-bold text-textPrimary leading-snug mb-3">
        Please share any additional comments, suggestions, or feedback.
      </h3>

      <div className="relative">
        <textarea
          rows={4}
          maxLength={maxLength}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Feel free to share any specific suggestions, compliments, or areas where we can improve your overall banking experience..."
          className="w-full p-3.5 bg-gray-50/70 border border-bankBorder rounded-xl text-sm text-textPrimary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all resize-none font-sans"
        />

        <div className="flex items-center justify-between mt-2 px-1 text-xs">
          <div className="flex items-center gap-1 text-textSecondary text-[11px]">
            <Edit3 className="w-3.5 h-3.5 text-gray-400" />
            <span>Optional feedback</span>
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
