'use client';

import React, { useState } from 'react';
import { IciciHeader } from './components/IciciHeader';
import { NpsPageOne } from './components/NpsPageOne';
import { Q1FollowUpPageTwo } from './components/Q1FollowUpPageTwo';
import { Q2ResolutionPageThree } from './components/Q2ResolutionPageThree';
import { Q2FollowUpPageFour } from './components/Q2FollowUpPageFour';
import { AspectsPageFive } from './components/AspectsPageFive';
import { Q4FeedbackPageSix } from './components/Q4FeedbackPageSix';
import { SuccessPageThree } from './components/SuccessPageThree';
import { DeviceSimulator } from './components/DeviceSimulator';
import { HeaderBanner } from './components/HeaderBanner';
import { DeviceWidth, SurveyState, RatingOption, EaseOption } from './types/survey';

export const App: React.FC = () => {
  const [deviceWidth, setDeviceWidth] = useState<DeviceWidth>('390px');

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

  // Next Handlers
  const handleNextFromQ1 = () => {
    if (surveyState.npsScore === null) return;
    setSurveyState((prev) => ({ ...prev, page: 2 }));
  };

  const handleNextFromQ1FollowUp = () => {
    setSurveyState((prev) => ({ ...prev, page: 3 }));
  };

  const handleNextFromQ2 = () => {
    if (surveyState.resolutionEase === null) return;
    const isDifficult =
      surveyState.resolutionEase === 'Difficult' ||
      surveyState.resolutionEase === 'Very Difficult';

    if (isDifficult) {
      setSurveyState((prev) => ({ ...prev, page: 4 }));
    } else {
      setSurveyState((prev) => ({ ...prev, page: 5 }));
    }
  };

  const handleNextFromQ2FollowUp = () => {
    setSurveyState((prev) => ({ ...prev, page: 5 }));
  };

  const handleNextFromAspects = () => {
    setSurveyState((prev) => ({ ...prev, page: 6 }));
  };

  const handleFinish = () => {
    setSurveyState((prev) => ({ ...prev, page: 7 }));
  };

  // Back Handler with Logical Branching reversal
  const handleBackPage = () => {
    const { page, resolutionEase } = surveyState;

    if (page === 2) {
      setSurveyState((prev) => ({ ...prev, page: 1 }));
    } else if (page === 3) {
      setSurveyState((prev) => ({ ...prev, page: 2 }));
    } else if (page === 4) {
      setSurveyState((prev) => ({ ...prev, page: 3 }));
    } else if (page === 5) {
      const isDifficult =
        resolutionEase === 'Difficult' || resolutionEase === 'Very Difficult';
      setSurveyState((prev) => ({ ...prev, page: isDifficult ? 4 : 3 }));
    } else if (page === 6) {
      setSurveyState((prev) => ({ ...prev, page: 5 }));
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

  // Compute Clean Progress Percentage
  const getProgressPercentage = () => {
    switch (surveyState.page) {
      case 1:
        return 16;
      case 2:
        return 33;
      case 3:
        return 50;
      case 4:
        return 66;
      case 5:
        return 83;
      case 6:
        return 98;
      default:
        return undefined;
    }
  };

  const progressPercentage = getProgressPercentage();

  return (
    <DeviceSimulator deviceWidth={deviceWidth}>
      {/* Device Switcher Bar */}
      <HeaderBanner
        currentDeviceWidth={deviceWidth}
        setDeviceWidth={setDeviceWidth}
      />

      {/* ICICI Style Red App Header with Sleek Minimalist Progress Bar */}
      <IciciHeader
        onBack={handleBackPage}
        showBack={surveyState.page > 1 && surveyState.page < 7}
        title="Feedback"
        progressPercentage={progressPercentage}
      />

      {/* 1 Question Per Screen Controller */}
      <div className="flex-1 flex flex-col min-h-0 bg-bankBg">
        {/* Screen 1: Question 1 (NPS) */}
        {surveyState.page === 1 && (
          <NpsPageOne
            npsScore={surveyState.npsScore}
            onScoreSelect={handleScoreSelect}
            onNext={handleNextFromQ1}
          />
        )}

        {/* Screen 2: Q1 Follow-up (Q1a if 0-8, Q1b if 9-10) */}
        {surveyState.page === 2 && (
          <Q1FollowUpPageTwo
            npsScore={surveyState.npsScore}
            value={surveyState.q1FollowUpText}
            onChange={handleQ1FollowUpChange}
            onNext={handleNextFromQ1FollowUp}
          />
        )}

        {/* Screen 3: Question 2 (Resolution Ease) */}
        {surveyState.page === 3 && (
          <Q2ResolutionPageThree
            value={surveyState.resolutionEase}
            onChange={handleResolutionEaseChange}
            onNext={handleNextFromQ2}
          />
        )}

        {/* Screen 4: Q2a Follow-up (ONLY if Difficult or Very Difficult) */}
        {surveyState.page === 4 && (
          <Q2FollowUpPageFour
            value={surveyState.q2FollowUpText}
            onChange={handleQ2FollowUpChange}
            onNext={handleNextFromQ2FollowUp}
          />
        )}

        {/* Screen 5: Question 3 (Aspect Ratings) */}
        {surveyState.page === 5 && (
          <AspectsPageFive
            ratings={surveyState.aspectRatings}
            onRatingSelect={handleAspectRatingSelect}
            onFinish={handleNextFromAspects}
          />
        )}

        {/* Screen 6: Question 4 (Q4 General Open-End Feedback) */}
        {surveyState.page === 6 && (
          <Q4FeedbackPageSix
            value={surveyState.q4FeedbackText}
            onChange={handleQ4FeedbackChange}
            onFinish={handleFinish}
          />
        )}

        {/* Screen 7: Success / Confirmation (No Back Button, No Summary Box, No Test Button) */}
        {surveyState.page === 7 && (
          <SuccessPageThree
            surveyState={surveyState}
            onReset={handleReset}
          />
        )}
      </div>
    </DeviceSimulator>
  );
};

export default App;
