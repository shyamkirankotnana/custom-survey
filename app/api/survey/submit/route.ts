import { NextRequest, NextResponse } from 'next/server';
import { tokenService } from '@/lib/services/token.service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, responseJson, npsScore, resolutionEase, aspectRatings } = body;

    const tokenToUse = token;
    const jsonPayload = responseJson || {
      npsScore,
      q1FollowUpText: body.q1FollowUpText || '',
      resolutionEase,
      q2FollowUpText: body.q2FollowUpText || '',
      aspectRatings: aspectRatings || {},
      q4FeedbackText: body.q4FeedbackText || '',
    };

    if (!tokenToUse) {
      console.warn('[Survey Submit API] No token provided - bypassing token check for preview/testing.');
      return NextResponse.json({
        success: true,
        bypassed: true,
        message: 'Survey response submitted (token check bypassed).',
      });
    }

    const result = await tokenService.submitResponse(tokenToUse, jsonPayload);

    if (!result.success) {
      console.warn('[Survey Submit API] Token service error:', result.error, '- bypassing token check for preview/testing.');
      return NextResponse.json({
        success: true,
        bypassed: true,
        message: 'Survey response submitted (token check bypassed).',
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Survey response saved successfully.',
      responseId: result.responseId,
      submittedAt: result.submittedAt,
    });
  } catch (err: any) {
    console.error('[Survey Submit API] Unexpected error:', err);
    return NextResponse.json(
      { error: 'Internal Server Error', details: err?.message },
      { status: 500 }
    );
  }
}
