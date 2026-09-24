export type NpsScore = number | null;

export type EaseOption = 'Very Easy' | 'Easy' | 'Difficult' | 'Very Difficult' | null;

export type RatingOption = 'Very Poor' | 'Poor' | 'Good' | 'Very Good' | null;

export interface AspectRatingItem {
  id: string;
  title: string;
  subtitle?: string;
  category?: string;
}

export type AspectRating = AspectRatingItem;

export interface SurveyState {
  page: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  npsScore: NpsScore;
  q1FollowUpText: string;
  resolutionEase: EaseOption;
  q2FollowUpText: string;
  aspectRatings: Record<string, RatingOption>;
  q4FeedbackText: string;
}

export type DeviceWidth = '320px' | '360px' | '375px' | '390px' | '414px';
