import { NextRequest, NextResponse } from 'next/server';
import { responseService } from '@/lib/services/response.service';

export async function GET(req: NextRequest) {
  try {
    const responses = await responseService.getAllResponses(10000);
    const jsonContent = JSON.stringify(responses, null, 2);

    return new NextResponse(jsonContent, {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Disposition': `attachment; filename="survey_responses_${Date.now()}.json"`,
      },
    });
  } catch (err: any) {
    console.error('[JSON Export API] Error:', err);
    return NextResponse.json(
      { error: 'Failed to export JSON', details: err?.message },
      { status: 500 }
    );
  }
}
