import { NextRequest, NextResponse } from 'next/server';
import { analyticsService } from '@/lib/services/analytics.service';

export async function GET(req: NextRequest) {
  try {
    const npsData = await analyticsService.getNpsAnalytics();
    const funnelData = await analyticsService.getFunnelMetrics();

    return NextResponse.json({
      success: true,
      nps: npsData,
      funnel: funnelData,
    });
  } catch (err: any) {
    console.error('[Admin Analytics API] Error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch analytics', details: err?.message },
      { status: 500 }
    );
  }
}
