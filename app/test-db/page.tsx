import { supabase } from '@/lib/supabase';
import { CheckCircle2, AlertTriangle, Database } from 'lucide-react';

export const revalidate = 0; // Disable static caching for live DB validation

export default async function TestDbPage() {
  let surveys: any[] = [];
  let errorMsg: string | null = null;
  let isConnected = false;

  try {
    const { data, error } = await supabase.from('surveys').select('*');
    if (error) {
      errorMsg = error.message;
    } else {
      surveys = data || [];
      isConnected = true;
    }
  } catch (err: any) {
    errorMsg = err?.message || 'Unknown database connection error';
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans text-gray-900 flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gray-900 text-white p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-500 rounded-lg">
              <Database className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Phase 1: Database Connectivity Test</h1>
              <p className="text-xs text-gray-400">Next.js ↔ Supabase Validation</p>
            </div>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
              isConnected
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}
          >
            {isConnected ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                Connected
              </>
            ) : (
              <>
                <AlertTriangle className="w-3.5 h-3.5" />
                Connection Error
              </>
            )}
          </span>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {errorMsg ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl space-y-2">
              <div className="flex items-center space-x-2 text-red-700 font-bold text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>Failed to Fetch 'surveys' Table</span>
              </div>
              <p className="text-xs text-red-600 font-mono bg-red-100/50 p-2.5 rounded-lg overflow-x-auto">
                {errorMsg}
              </p>
              <p className="text-xs text-gray-600 mt-2">
                <strong>Next Step:</strong> Ensure you ran the SQL script in your Supabase SQL Editor:
                <code className="ml-1 bg-gray-200 px-1.5 py-0.5 rounded text-gray-800 font-mono">
                  supabase/phase1_surveys.sql
                </code>
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-extrabold uppercase tracking-wider text-gray-500">
                  Fetched Records ({surveys.length})
                </h2>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-0.5 rounded-md">
                  Live Supabase Data
                </span>
              </div>

              {surveys.length === 0 ? (
                <div className="p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300 space-y-2">
                  <p className="text-sm font-semibold text-gray-600">
                    Connected to Supabase, but the <code className="font-mono">surveys</code> table is empty.
                  </p>
                  <p className="text-xs text-gray-500">
                    Run <code className="font-mono text-orange-600">supabase/phase1_surveys.sql</code> in your Supabase SQL Editor to insert the initial test record.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {surveys.map((survey: any) => (
                    <div
                      key={survey.id}
                      className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-orange-400 transition-all space-y-2"
                    >
                      <div className="flex items-start justify-between">
                        <h3 className="font-bold text-gray-900 text-base">{survey.name}</h3>
                        <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full capitalize">
                          {survey.status || 'active'}
                        </span>
                      </div>
                      {survey.description && (
                        <p className="text-xs text-gray-600">{survey.description}</p>
                      )}
                      <div className="pt-2 border-t border-gray-200 flex items-center justify-between text-[11px] text-gray-400 font-mono">
                        <span>ID: {survey.id}</span>
                        <span>Created: {new Date(survey.created_at).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
