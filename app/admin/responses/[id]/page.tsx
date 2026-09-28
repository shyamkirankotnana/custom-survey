import { responseService } from '@/lib/services/response.service';
import { ArrowLeft, Clock, Code, Database, FileText, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 0; // Disable static caching for live response detail inspection

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ResponseDetailPage({ params }: PageProps) {
  const { id } = await params;
  const responseData = await responseService.getResponseById(id);

  if (!responseData) {
    return (
      <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans text-gray-900">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 p-8 text-center space-y-4">
          <Database className="w-10 h-10 text-gray-300 mx-auto" />
          <h1 className="text-xl font-bold text-gray-900">Response Not Found</h1>
          <p className="text-xs text-gray-500">
            No response record found matching ID <code className="font-mono bg-gray-100 px-1 py-0.5 rounded">{id}</code>.
          </p>
          <Link
            href="/admin/responses"
            className="inline-flex items-center space-x-2 text-xs font-bold text-orange-600 hover:underline pt-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Responses Dashboard</span>
          </Link>
        </div>
      </main>
    );
  }

  const json = responseData.response_json || {};
  const tokenMeta = responseData.survey_tokens;

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans text-gray-900">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/admin/responses"
            className="inline-flex items-center space-x-2 text-xs font-extrabold text-gray-600 hover:text-gray-900 bg-white border border-gray-200 px-3.5 py-2 rounded-xl shadow-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>

          <span className="text-xs font-mono text-gray-400">Response ID: {responseData.id}</span>
        </div>

        {/* Title Header Card */}
        <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-orange-500 rounded-xl">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold">Response Detail Inspection</h1>
              <p className="text-xs text-gray-400">Token-Linked Survey Submission Record</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs bg-gray-800 px-3.5 py-1.5 rounded-full border border-gray-700 font-mono">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Token: {tokenMeta?.token || 'N/A'}</span>
          </div>
        </div>

        {/* Metadata Timeline Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-1">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Submitted At</span>
            <div className="text-xs font-bold text-gray-900 font-mono">
              {new Date(responseData.submitted_at).toLocaleString()}
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-1">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Opened At</span>
            <div className="text-xs font-bold text-gray-900 font-mono">
              {tokenMeta?.opened_at ? new Date(tokenMeta.opened_at).toLocaleString() : 'N/A'}
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-1">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Token Status</span>
            <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
              {tokenMeta?.status || 'completed'}
            </div>
          </div>
        </div>

        {/* Formatted Answer Summary Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-gray-500 border-b border-gray-100 pb-3">
            Survey Response Summary
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* NPS */}
            <div className="space-y-1.5 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-xs font-extrabold uppercase tracking-wider text-gray-500">Q1: NPS Score</span>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-black text-gray-900">{json.npsScore ?? 'N/A'}</span>
                {json.npsScore !== undefined && (
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      json.npsScore >= 9
                        ? 'bg-emerald-100 text-emerald-800'
                        : json.npsScore >= 7
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {json.npsScore >= 9 ? 'Promoter' : json.npsScore >= 7 ? 'Passive' : 'Detractor'}
                  </span>
                )}
              </div>
              {json.q1FollowUpText && (
                <p className="text-xs text-gray-600 italic pt-1 border-t border-gray-200/60">
                  "{json.q1FollowUpText}"
                </p>
              )}
            </div>

            {/* Resolution Ease */}
            <div className="space-y-1.5 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-xs font-extrabold uppercase tracking-wider text-gray-500">Q2: Resolution Ease</span>
              <div className="text-lg font-bold text-gray-900">{json.resolutionEase || 'N/A'}</div>
              {json.q2FollowUpText && (
                <p className="text-xs text-gray-600 italic pt-1 border-t border-gray-200/60">
                  "{json.q2FollowUpText}"
                </p>
              )}
            </div>
          </div>

          {/* Aspect Ratings Grid */}
          {json.aspectRatings && Object.keys(json.aspectRatings).length > 0 && (
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-500">
                Q3: Aspect Ratings ({Object.keys(json.aspectRatings).length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {Object.entries(json.aspectRatings).map(([aspectKey, ratingVal]) => (
                  <div key={aspectKey} className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex justify-between items-center">
                    <span className="font-semibold text-gray-800 capitalize">{aspectKey.replace(/_/g, ' ')}</span>
                    <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[11px]">
                      {String(ratingVal)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Q4 Feedback */}
          {json.q4FeedbackText && (
            <div className="space-y-1.5 p-4 bg-orange-50/50 border border-orange-200 rounded-xl">
              <span className="text-xs font-extrabold uppercase tracking-wider text-orange-800">
                Q4: Qualitative Feedback
              </span>
              <p className="text-xs text-gray-800 leading-relaxed font-sans">{json.q4FeedbackText}</p>
            </div>
          )}
        </div>

        {/* Raw JSON Inspection Card */}
        <div className="bg-gray-900 text-white rounded-2xl p-6 shadow-xl space-y-3 border border-gray-800">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <div className="flex items-center space-x-2 text-xs font-extrabold uppercase tracking-wider text-orange-400">
              <Code className="w-4 h-4" />
              <span>Raw JSON Payload (response_json)</span>
            </div>
            <span className="text-[11px] font-mono text-gray-500">JSONB PostgreSQL Storage</span>
          </div>

          <pre className="p-4 bg-black/60 rounded-xl font-mono text-xs text-emerald-400 overflow-x-auto leading-relaxed border border-gray-800">
            {JSON.stringify(json, null, 2)}
          </pre>
        </div>
      </div>
    </main>
  );
}
