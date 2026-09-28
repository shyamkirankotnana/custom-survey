import { NextRequest, NextResponse } from 'next/server';
import { responseService } from '@/lib/services/response.service';

export async function GET(req: NextRequest) {
  try {
    const summary = await responseService.getSummaryMetrics();
    const responses = await responseService.getAllResponses(200);

    return NextResponse.json({
      success: true,
      summary,
      count: responses.length,
      responses,
    });
  } catch (err: any) {
    console.error('[Admin Responses List API] Error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch responses', details: err?.message },
      { status: 500 }
    );
  }
}
