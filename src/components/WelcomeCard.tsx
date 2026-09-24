import React from 'react';
import { UserCheck, Calendar, Sparkles } from 'lucide-react';

export const WelcomeCard: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-card border border-bankBorder mb-4 relative overflow-hidden transition-all hover:shadow-card-hover">
      {/* Decorative accent top bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-red-500 to-red-600" />
      
      {/* Badge header */}
      <div className="flex items-center justify-between mb-3 pt-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-primary text-xs font-bold border border-red-100">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>RM Feedback Portal</span>
        </div>
        <div className="text-[11px] text-textSecondary flex items-center gap-1 font-medium">
          <Calendar className="w-3 h-3 text-gray-400" />
          <span>Ref: RM-2026-8842</span>
        </div>
      </div>

      {/* Main Title */}
      <h2 className="text-xl font-extrabold text-textPrimary mb-3 tracking-tight">
        Customer Feedback Survey
      </h2>

      {/* Description */}
      <div className="text-sm text-textSecondary space-y-2.5 leading-relaxed font-normal">
        <p className="font-semibold text-textPrimary">Dear Customer,</p>
        <p>
          Thank you for banking with us. We value your feedback regarding your recent interaction with your Relationship Manager.
        </p>
        <p>
          Your feedback helps us continuously improve our services and customer experience.
        </p>
      </div>

      {/* Assigned RM Card Meta */}
      <div className="mt-4 pt-3.5 border-t border-gray-100 flex items-center justify-between bg-gray-50/80 -mx-5 -mb-5 px-5 py-3 rounded-b-2xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm">
            RS
          </div>
          <div>
            <div className="text-xs font-bold text-textPrimary flex items-center gap-1">
              <span>Rajesh Sharma</span>
              <UserCheck className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <div className="text-[11px] text-textSecondary font-medium">
              Senior Relationship Manager • Wealth Management
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
