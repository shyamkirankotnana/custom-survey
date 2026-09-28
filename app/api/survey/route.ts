import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '../../../src/lib/supabaseServer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      npsScore,
      q1FollowUpText,
      resolutionEase,
      q2FollowUpText,
      aspectRatings,
      q4FeedbackText,
    } = body;

    // Check if Supabase credentials are configured
    const isSupabaseConfigured =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-supabase-project') &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes('your-supabase-anon-key');

    // Basic Validation
    if (npsScore === null || npsScore === undefined) {
      return NextResponse.json(
        { error: 'NPS Score is required' },
        { status: 400 }
      );
    }

    if (!resolutionEase) {
      return NextResponse.json(
        { error: 'Resolution Ease option is required' },
        { status: 400 }
      );
    }

    // Capture requester metadata
    const userAgent = req.headers.get('user-agent') || undefined;
    const forwardedFor = req.headers.get('x-forwarded-for');
    const ipAddress = forwardedFor ? forwardedFor.split(',')[0].trim() : undefined;

    const payload = {
      nps_score: npsScore,
      q1_follow_up_text: q1FollowUpText || null,
      resolution_ease: resolutionEase,
      q2_follow_up_text: q2FollowUpText || null,
      aspect_ratings: aspectRatings || {},
      q4_feedback_text: q4FeedbackText || null,
      user_agent: userAgent,
      ip_address: ipAddress,
    };

    if (!isSupabaseConfigured) {
      console.warn('[Survey API] Supabase credentials not configured in .env.local. Simulating response persistence.');
      return NextResponse.json({
        success: true,
        simulated: true,
        message: 'Survey response received (Simulated Mode - configure .env.local with Supabase credentials for real database persistence)',
        data: payload,
      });
    }

    // Insert into Supabase table survey_responses
    const { data, error } = await supabaseServer
      .from('survey_responses')
      .insert([payload])
      .select('id, created_at')
      .single();

    if (error) {
      console.error('[Survey API] Supabase insert error:', error);
      return NextResponse.json(
        { error: 'Failed to save survey response to database', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      id: data?.id,
      created_at: data?.created_at,
    });
  } catch (err: any) {
    console.error('[Survey API] Unexpected error:', err);
    return NextResponse.json(
      { error: 'Internal Server Error', details: err?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
