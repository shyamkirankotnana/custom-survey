import { NextRequest, NextResponse } from 'next/server';
import { responseService } from '@/lib/services/response.service';

export async function GET(req: NextRequest) {
  try {
    const responses = await responseService.getAllResponses(10000);

    let csvContent = 'response_id,token,nps_score,resolution_ease,submitted_at,q1_followup,q2_followup,q4_feedback\n';

    responses.forEach((r) => {
      const token = r.survey_tokens?.token || 'N/A';
      const json = r.response_json || {};
      const nps = json.npsScore ?? '';
      const ease = json.resolutionEase ?? '';
      const q1 = (json.q1FollowUpText || '').replace(/"/g, '""');
      const q2 = (json.q2FollowUpText || '').replace(/"/g, '""');
      const q4 = (json.q4FeedbackText || '').replace(/"/g, '""');

      csvContent += `"${r.id}","${token}","${nps}","${ease}","${r.submitted_at}","${q1}","${q2}","${q4}"\n`;
    });

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="survey_responses_${Date.now()}.csv"`,
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
