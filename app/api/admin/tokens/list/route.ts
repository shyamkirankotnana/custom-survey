import { NextRequest, NextResponse } from 'next/server';
import { tokenService } from '@/lib/services/token.service';

export async function GET(req: NextRequest) {
  try {
    const tokens = await tokenService.getAllTokens(500);
    return NextResponse.json({
      success: true,
      count: tokens.length,
      tokens,
    });
  } catch (err: any) {
    console.error('[Admin List API] Error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch tokens', details: err?.message },
      { status: 500 }
    );
  }
}
