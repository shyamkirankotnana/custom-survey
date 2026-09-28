import { tokenService } from '@/lib/services/token.service';
import App from '@/src/App';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export const revalidate = 0; // Disable static caching for live survey route

interface PageProps {
  params: Promise<{ token: string }>;
}

export default async function SurveyFormPage({ params }: PageProps) {
  const { token } = await params;
  const validation = await tokenService.validateToken(token);

  // CASE 1: Token Already Completed
  if (validation.status === 'completed') {
    return (
      <main className="min-h-screen bg-bankBg flex flex-col items-center justify-center p-4 font-sans text-textPrimary">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-bankBorder p-8 text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full mx-auto">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Thanks for completing the survey!
          </h1>
        </div>
      </main>
    );
  }

  // CASE 2: Token Invalid or Expired
  if (!validation.valid) {
    return (
      <main className="min-h-screen bg-bankBg flex flex-col items-center justify-center p-4 font-sans text-textPrimary">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-bankBorder p-8 text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 text-red-600 rounded-full mx-auto">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Invalid survey link.
          </h1>
        </div>
      </main>
    );
  }

  // CASE 3: Valid Token (pending or opened) -> Ensure token is marked as opened & render Survey App
  await tokenService.markOpened(token);
  return <App token={token} />;
}
