import { NextRequest, NextResponse } from 'next/server';
import { tokenService } from '@/lib/services/token.service';

export async function GET(req: NextRequest) {
  try {
    const tokens = await tokenService.getAllTokens(10000);
    const host = req.headers.get('host') || 'custom-survey-ebon.vercel.app';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    let csvContent = 'token,url,status,generated_at\n';
    tokens.forEach((t) => {
      const url = `${baseUrl}/s/${t.token}`;
      csvContent += `"${t.token}","${url}","${t.status}","${t.generated_at}"\n`;
    });

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="survey_tokens_${Date.now()}.csv"`,
      },
    });
  } catch (err: any) {
    console.error('[CSV Export API] Error:', err);
    return NextResponse.json(
      { error: 'Failed to export CSV', details: err?.message },
      { status: 500 }
    );
  }
}
