import { NextRequest, NextResponse } from 'next/server';
import { tokenService } from '@/lib/services/token.service';

export async function GET(req: NextRequest) {
  try {
    const batches = await tokenService.getBatchHistory();
    return NextResponse.json({
      success: true,
      batches: batches || [],
    });
  } catch (err: any) {
    console.error('[Admin Batches API] Error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch batch history', details: err?.message },
      { status: 500 }
    );
  }
}
