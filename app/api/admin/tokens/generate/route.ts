import { NextRequest, NextResponse } from 'next/server';
import { tokenService } from '@/lib/services/token.service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const count = Number(body.count) || 100;

    const generated = await tokenService.generateBatch(count);

    return NextResponse.json({
      success: true,
      count: generated.length,
      message: `Successfully generated and stored ${generated.length} survey tokens in database.`,
      tokens: generated,
    });
  } catch (err: any) {
    console.error('[Admin Generate API] Error:', err);
    return NextResponse.json(
      { error: 'Failed to generate tokens', details: err?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
