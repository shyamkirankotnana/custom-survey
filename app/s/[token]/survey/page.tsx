import { tokenService } from '@/lib/services/token.service';
import App from '@/src/App';
import { AlertCircle, Clock } from 'lucide-react';

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
        </div>
      </main>
    );
  }

  // CASE 2: Token Invalid or Expired
  if (!validation.valid) {
    return (
      <main className="min-h-screen bg-bankBg flex flex-col items-center justify-center p-4 font-sans text-textPrimary">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-bankBorder p-8 text-center space-y-5">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 text-red-600 rounded-full">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-bold text-gray-900">Invalid Survey Link</h1>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              The survey link (<code className="font-mono font-bold text-red-600">{token}</code>) is invalid or no longer available.
            </p>
          </div>
        </div>
      </main>
    );
  }

  // CASE 3: Valid Token (pending or opened) -> Ensure token is marked as opened & render Survey App
  await tokenService.markOpened(token);
  return <App token={token} />;
}
