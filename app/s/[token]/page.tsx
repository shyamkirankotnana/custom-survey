import { tokenService } from '@/lib/services/token.service';
import { CheckCircle2, AlertCircle, Clock, ShieldCheck } from 'lucide-react';
import { StartSurveyButton } from '@/src/components/StartSurveyButton';

export const revalidate = 0; // Disable static caching for dynamic token validation

interface PageProps {
  params: Promise<{ token: string }>;
}

export default async function SurveyTokenPage({ params }: PageProps) {
  const { token } = await params;

  // Read-only token validation (NO automatic state mutation on page load)
  const validation = await tokenService.validateToken(token);

  // CASE 1: Valid Token (pending or opened) -> Load Survey Landing View
  if (validation.valid) {
    const isPending = validation.status === 'pending';

    return (
      <main className="min-h-screen bg-bankBg flex flex-col items-center justify-center p-4 font-sans text-textPrimary">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-bankBorder overflow-hidden">
          {/* Header */}
          <div className="bg-gray-900 text-white p-6 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-orange-500 rounded-xl">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold">Survey Token Verified</h1>
                <p className="text-xs text-gray-400">ICICI Bank RM Survey Platform</p>
              </div>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                isPending
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}
            >
              {validation.status}
            </span>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-50 rounded-full text-emerald-600 mb-2">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-gray-900">Token Access Validated</h2>
              <p className="text-xs text-gray-600 leading-relaxed">
                Respondent token <code className="bg-gray-100 text-orange-600 font-mono px-2 py-0.5 rounded font-bold">{token}</code> is active and registered in <code className="font-mono text-gray-800">survey_tokens</code>.
              </p>
            </div>

            <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-left space-y-1.5">
              <div className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Token Access Details
              </div>
              <p className="text-xs text-gray-600">
                • Current DB Status: <strong className="capitalize text-gray-900">{validation.status}</strong><br />
                • State Transition: <span className="text-gray-500">Will update to 'opened' when respondent starts survey</span>
              </p>
            </div>

            <StartSurveyButton token={token} />
          </div>
        </div>
      </main>
    );
  }

  // CASE 2: Token Already Completed
  if (validation.status === 'completed') {
    return (
      <main className="min-h-screen bg-bankBg flex flex-col items-center justify-center p-4 font-sans text-textPrimary">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-bankBorder p-8 text-center space-y-5">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 text-blue-600 rounded-full">
            <Clock className="w-8 h-8 text-blue-600" />
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-bold text-gray-900">Survey Already Completed</h1>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              This survey link (<code className="font-mono font-bold text-gray-800">{token}</code>) has already been completed. Thank you for your valuable feedback!
            </p>
          </div>

          <div className="pt-4 border-t border-gray-100 text-xs text-gray-400">
            If you believe this is an error, please contact ICICI Bank support.
          </div>
        </div>
      </main>
    );
  }

  // CASE 3: Token Invalid or Expired
  return (
    <main className="min-h-screen bg-bankBg flex flex-col items-center justify-center p-4 font-sans text-textPrimary">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-bankBorder p-8 text-center space-y-5">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 text-red-600 rounded-full">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-bold text-gray-900">Invalid Survey Link</h1>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            The survey link (<code className="font-mono font-bold text-red-600">{token}</code>) is invalid, expired, or no longer available.
          </p>
        </div>

        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
          Please check the URL or request a new survey invitation link.
        </div>
      </div>
    </main>
  );
}
