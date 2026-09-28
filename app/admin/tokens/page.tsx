'use client';

import React, { useState, useEffect } from 'react';
import { KeyRound, Download, RefreshCw, CheckCircle2, Clock, Eye, AlertCircle, PlusCircle } from 'lucide-react';

export default function AdminTokensPage() {
  const [tokens, setTokens] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const fetchTokens = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/tokens/generate', { method: 'GET' }).catch(() => null);
      // Fetch via direct client service endpoint or API route
      const listRes = await fetch('/api/admin/tokens/export').then((r) => r.text());
      // For fast client loading, we can also fetch directly via supabase or API
      const response = await fetch('/api/survey/list-tokens').catch(() => null);
      if (response && response.ok) {
        const data = await response.json();
        setTokens(data.tokens || []);
      }
    } catch (err) {
      console.error('Fetch tokens error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTokens();
  }, []);

  const loadTokens = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/tokens/list');
      if (res.ok) {
        const data = await res.json();
        setTokens(data.tokens || []);
      }
    } catch (err) {
      console.error('Error loading tokens:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate100 = async () => {
    setIsGenerating(true);
    setNotification(null);
    try {
      const res = await fetch('/api/admin/tokens/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: 100 }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Generation failed');

      setNotification(`Successfully generated 100 NanoID tokens!`);
      await loadTokens();
    } catch (err: any) {
      setNotification(`Error: ${err?.message || 'Failed to generate tokens'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadCSV = () => {
    window.open('/api/admin/tokens/export', '_blank');
  };

  const pendingCount = tokens.filter((t) => t.status === 'pending').length;
  const openedCount = tokens.filter((t) => t.status === 'opened').length;
  const completedCount = tokens.filter((t) => t.status === 'completed').length;

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans text-gray-900">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Top Title Bar */}
        <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-orange-500 rounded-xl">
              <KeyRound className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Admin Token Generator</h1>
              <p className="text-xs text-gray-400">NanoID Link Engine & Access Management</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              onClick={handleGenerate100}
              disabled={isGenerating}
              className="flex-1 sm:flex-none px-5 py-2.5 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-extrabold text-sm rounded-xl flex items-center justify-center space-x-2 transition-all shadow-md disabled:opacity-50 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" />
                  <span>Generate 100 Tokens</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadCSV}
              className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 active:scale-95 text-white font-bold text-sm rounded-xl flex items-center space-x-2 transition-all border border-gray-700 cursor-pointer"
              title="Download token,url CSV file"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Notification Banner */}
        {notification && (
          <div
            className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between ${
              notification.startsWith('Error')
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            }`}
          >
            <span>{notification}</span>
            <button onClick={() => setNotification(null)} className="font-bold underline text-gray-500">
              Dismiss
            </button>
          </div>
        )}

        {/* Analytics Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-1">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Tokens</span>
            <div className="text-2xl font-black text-gray-900">{tokens.length}</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-1">
            <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Pending</span>
            <div className="text-2xl font-black text-amber-600">{pendingCount}</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-1">
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Opened</span>
            <div className="text-2xl font-black text-emerald-600">{openedCount}</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-1">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Completed</span>
            <div className="text-2xl font-black text-blue-600">{completedCount}</div>
          </div>
        </div>

        {/* Token Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-gray-700">
              Survey Links Database ({tokens.length})
            </h2>
            <button
              onClick={loadTokens}
              className="text-xs font-semibold text-gray-500 hover:text-gray-900 flex items-center space-x-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>
          </div>

          {loading ? (
            <div className="p-12 text-center text-gray-400 font-semibold text-xs">
              Loading tokens from Supabase...
            </div>
          ) : tokens.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <KeyRound className="w-8 h-8 text-gray-300 mx-auto" />
              <p className="text-sm font-semibold text-gray-600">No tokens generated yet.</p>
              <p className="text-xs text-gray-400">
                Click <strong>"Generate 100 Tokens"</strong> to create your first batch of NanoIDs.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-[11px] font-extrabold uppercase text-gray-500">
                    <th className="py-3 px-4">#</th>
                    <th className="py-3 px-4">Token</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Test Link</th>
                    <th className="py-3 px-4">Generated At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {tokens.map((t, idx) => (
                    <tr key={t.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3 px-4 text-gray-400 font-mono">{idx + 1}</td>
                      <td className="py-3 px-4 font-mono font-bold text-gray-900">{t.token}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                            t.status === 'pending'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : t.status === 'opened'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : t.status === 'completed'
                              ? 'bg-blue-100 text-blue-800 border border-blue-200'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <a
                          href={`/s/${t.token}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-orange-600 font-mono hover:underline text-[11px] font-bold"
                        >
                          /s/{t.token}
                        </a>
                      </td>
                      <td className="py-3 px-4 text-gray-400 font-mono text-[11px]">
                        {new Date(t.generated_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
