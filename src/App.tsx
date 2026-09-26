'use client';

import React, { useState } from 'react';
import { IciciHeader } from './components/IciciHeader';
import { NpsPageOne } from './components/NpsPageOne';
import { Q2ResolutionPageThree } from './components/Q2ResolutionPageThree';
import { AspectsPageFive } from './components/AspectsPageFive';
import { SuccessPageThree } from './components/SuccessPageThree';
import { SurveyState, RatingOption, EaseOption } from './types/survey';

// Simplified page flow:
// Page 1: NPS + inline follow-up (Q1 + Q1a/Q1b on same screen)
// Page 2: CES + inline follow-up (Q2 + Q2a on same screen)
// Page 3: Aspect Ratings + Q4 Feedback (Q3 + Q4 on same screen)
// Page 4: Success

export const App: React.FC = () => {
  const [surveyState, setSurveyState] = useState<SurveyState>({
    page: 1,
    npsScore: null,
    q1FollowUpText: '',
    resolutionEase: null,
    q2FollowUpText: '',
    aspectRatings: {},
    q4FeedbackText: '',
  });

  const handleScoreSelect = (score: number) => {
    setSurveyState((prev) => ({ ...prev, npsScore: score }));
  };

  const handleQ1FollowUpChange = (text: string) => {
    setSurveyState((prev) => ({ ...prev, q1FollowUpText: text }));
  };

  const handleResolutionEaseChange = (option: EaseOption) => {
    setSurveyState((prev) => ({ ...prev, resolutionEase: option }));
  };

  const handleQ2FollowUpChange = (text: string) => {
    setSurveyState((prev) => ({ ...prev, q2FollowUpText: text }));
  };

  const handleAspectRatingSelect = (id: string, option: RatingOption) => {
    setSurveyState((prev) => ({
      ...prev,
      aspectRatings: { ...prev.aspectRatings, [id]: option },
    }));
  };

  const handleQ4FeedbackChange = (text: string) => {
    setSurveyState((prev) => ({ ...prev, q4FeedbackText: text }));
  };

  // Next Handlers (simplified 3-screen flow)
  const handleNextFromQ1 = () => {
    if (surveyState.npsScore === null) return;
    setSurveyState((prev) => ({ ...prev, page: 2 as SurveyState['page'] }));
  };

  const handleNextFromQ2 = () => {
    if (surveyState.resolutionEase === null) return;
    setSurveyState((prev) => ({ ...prev, page: 3 as SurveyState['page'] }));
  };

  const handleFinish = () => {
    setSurveyState((prev) => ({ ...prev, page: 4 as SurveyState['page'] }));
  };

  // Back Handler
  const handleBackPage = () => {
    const { page } = surveyState;
    if (page === 2) {
      setSurveyState((prev) => ({ ...prev, page: 1 as SurveyState['page'] }));
    } else if (page === 3) {
      setSurveyState((prev) => ({ ...prev, page: 2 as SurveyState['page'] }));
    }
  };

  const handleReset = () => {
    setSurveyState({
      page: 1,
      npsScore: null,
      q1FollowUpText: '',
      resolutionEase: null,
      q2FollowUpText: '',
      aspectRatings: {},
      q4FeedbackText: '',
    });
  };

  // Progress percentage for 3 screens
  const getProgressPercentage = () => {
    switch (surveyState.page) {
      case 1: return 33;
      case 2: return 66;
      case 3: return 95;
      default: return undefined;
    }
  };

  const progressPercentage = getProgressPercentage();

  return (
    <div className="min-h-screen min-h-[100dvh] bg-bankBg flex flex-col w-full max-w-md mx-auto sm:my-4 sm:rounded-2xl sm:shadow-lg sm:border sm:border-gray-200 overflow-hidden">
      {/* ICICI Orange Header */}
      <IciciHeader
        onBack={handleBackPage}
        showBack={surveyState.page > 1 && surveyState.page < 4}
        title="ICICI Bank RM Survey"
        progressPercentage={progressPercentage}
      />

      {/* Screen Content */}
      <div className="flex-1 flex flex-col min-h-0 bg-bankBg">
        {/* Screen 1: NPS + Inline Follow-up */}
        {surveyState.page === 1 && (
          <NpsPageOne
            npsScore={surveyState.npsScore}
            onScoreSelect={handleScoreSelect}
            q1FollowUpText={surveyState.q1FollowUpText}
            onQ1FollowUpChange={handleQ1FollowUpChange}
            onNext={handleNextFromQ1}
          />
        )}

        {/* Screen 2: CES + Inline Follow-up */}
        {surveyState.page === 2 && (
          <Q2ResolutionPageThree
            value={surveyState.resolutionEase}
            onChange={handleResolutionEaseChange}
            q2FollowUpText={surveyState.q2FollowUpText}
            onQ2FollowUpChange={handleQ2FollowUpChange}
            onNext={handleNextFromQ2}
          />
        )}

        {/* Screen 3: Aspect Ratings + Q4 Feedback */}
        {surveyState.page === 3 && (
          <AspectsPageFive
            ratings={surveyState.aspectRatings}
            onRatingSelect={handleAspectRatingSelect}
            q4FeedbackText={surveyState.q4FeedbackText}
            onQ4FeedbackChange={handleQ4FeedbackChange}
            onFinish={handleFinish}
          />
        )}

        {/* Screen 4: Success */}
        {surveyState.page === 4 && (
          <SuccessPageThree
            surveyState={surveyState}
            onReset={handleReset}
          />
        )}
      </div>
    </div>
  );
};

export default App;
