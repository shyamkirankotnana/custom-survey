import { NextRequest, NextResponse } from 'next/server';
import { tokenService } from '@/lib/services/token.service';

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();
    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    const updated = await tokenService.markOpened(token);
    return NextResponse.json({
      success: updated,
      message: `Token ${token} status updated to 'opened'`,
    });
  } catch (err: any) {
    console.error('[Survey Open API Error]:', err);
    return NextResponse.json(
      { error: 'Failed to mark token as opened', details: err?.message },
      { status: 500 }
    );
  }
}
