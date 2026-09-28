'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Loader2 } from 'lucide-react';

interface StartSurveyButtonProps {
  token: string;
}

export const StartSurveyButton: React.FC<StartSurveyButtonProps> = ({ token }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleStart = async () => {
    setLoading(true);
    try {
      await fetch('/api/survey/open', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
    } catch (err) {
      console.error('Error updating token status:', err);
    } finally {
      // Navigate to the main survey app with token parameter
      router.push(`/?token=${encodeURIComponent(token)}`);
    }
  };

  return (
    <button
      onClick={handleStart}
      disabled={loading}
      className="w-full py-3 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-extrabold text-sm rounded-full flex items-center justify-center space-x-2 transition-all shadow-md cursor-pointer disabled:opacity-75"
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Starting Survey...</span>
        </>
      ) : (
        <>
          <span>Start Survey</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </>
      )}
    </button>
  );
};
