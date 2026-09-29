'use client';

import React, { useState, useEffect } from 'react';
import { KeyRound, Download, RefreshCw, CheckCircle2, Clock, Eye, AlertCircle, PlusCircle, Info } from 'lucide-react';

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

  const [sqlBatches, setSqlBatches] = useState<any[] | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Try fetching SQL View batch history directly
      const batchRes = await fetch('/api/admin/tokens/batches').catch(() => null);
      if (batchRes && batchRes.ok) {
        const batchData = await batchRes.json();
        if (batchData.batches && batchData.batches.length > 0) {
          setSqlBatches(batchData.batches);
        }
      }

      // 2. Fetch tokens list for stats fallback
      const res = await fetch('/api/admin/tokens/list');
      if (res.ok) {
        const data = await res.json();
        setTokens(data.tokens || []);
      }
    } catch (err) {
      console.error('Error loading token data:', err);
    } finally {
      setLoading(false);
    }
  };

  const [batchCount, setBatchCount] = useState<number>(1);

  const handleGenerate = async () => {
    const countToGenerate = batchCount || 1;
    setIsGenerating(true);
    setNotification(null);
    try {
      const res = await fetch('/api/admin/tokens/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: countToGenerate }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Generation failed');

      setNotification(`Successfully generated ${countToGenerate} survey link${countToGenerate > 1 ? 's' : ''}!`);
      await loadData();
    } catch (err: any) {
      setNotification(`Error: ${err?.message || 'Failed to generate tokens'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadCSV = () => {
    window.open('/api/admin/tokens/export', '_blank');
  };

  // Group tokens into Batch Generation history fallback
  const getFallbackBatches = () => {
    const groups: { [key: string]: any[] } = {};

    tokens.forEach((t) => {
      const timeKey = t.generated_at ? new Date(t.generated_at).toISOString().slice(0, 19) : 'Unknown';
      if (!groups[timeKey]) {
        groups[timeKey] = [];
      }
      groups[timeKey].push(t);
    });

    const timeKeys = Object.keys(groups).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    return timeKeys.map((key, idx) => {
      const batchTokens = groups[key];
      return {
        id: key,
        batchNumber: timeKeys.length - idx,
        timestamp: batchTokens[0]?.generated_at ? new Date(batchTokens[0].generated_at).toLocaleString() : key,
        count: batchTokens.length,
        pendingCount: batchTokens.filter((t) => t.status === 'pending').length,
        openedCount: batchTokens.filter((t) => t.status === 'opened').length,
        completedCount: batchTokens.filter((t) => t.status === 'completed').length,
        sampleToken: batchTokens[0]?.token || '',
      };
    });
  };

  const batches = sqlBatches || getFallbackBatches();

  // Aggregate totals across all batches or tokens
  const totalLinks = sqlBatches
    ? sqlBatches.reduce((acc, b) => acc + (b.count || 0), 0)
    : tokens.length;
  const pendingCount = sqlBatches
    ? sqlBatches.reduce((acc, b) => acc + (b.pendingCount || 0), 0)
    : tokens.filter((t) => t.status === 'pending').length;
  const openedCount = sqlBatches
    ? sqlBatches.reduce((acc, b) => acc + (b.openedCount || 0), 0)
    : tokens.filter((t) => t.status === 'opened').length;
  const completedCount = sqlBatches
    ? sqlBatches.reduce((acc, b) => acc + (b.completedCount || 0), 0)
    : tokens.filter((t) => t.status === 'completed').length;

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans text-gray-900 w-full">
      <div className="w-full max-w-[1600px] mx-auto space-y-6">
        {/* Top Title Bar */}
        <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-orange-500 rounded-xl">
              <KeyRound className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Admin Token Generator</h1>
              <p className="text-xs text-gray-400">Survey Link Engine & Access Management</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Batch Count Input & Generate Button */}
            <div className="flex items-center bg-gray-800 rounded-xl p-1.5 border border-gray-700 w-full sm:w-auto justify-between sm:justify-start">
              <span className="text-xs font-bold text-gray-400 px-3">Qty:</span>
              <input
                type="number"
                min="1"
                max="99999999"
                step="1"
                value={batchCount}
                onKeyDown={(e) => {
                  if (['.', 'e', 'E', '+', '-'].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
                onChange={(e) => {
                  const cleaned = e.target.value.replace(/[^0-9]/g, '');
                  setBatchCount(cleaned ? Math.max(1, parseInt(cleaned, 10)) : 1);
                }}
                className="w-36 sm:w-44 bg-gray-900 text-white text-sm font-mono font-black px-3 py-2 rounded-lg border border-gray-700 text-center focus:outline-none focus:border-orange-500 shadow-inner [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="ml-2 px-5 py-2 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-extrabold text-xs rounded-lg flex items-center space-x-2 transition-all shadow-md disabled:opacity-50 cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-4 h-4" />
                    <span>Generate</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Notification Banner */}
        {notification && (
          <div
            className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between gap-3 ${
              notification.startsWith('Error')
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            }`}
          >
            <div className="flex items-center space-x-2">
              <span>{notification}</span>
            </div>
            <div className="flex items-center space-x-3">
              {!notification.startsWith('Error') && (
                <button
                  onClick={handleDownloadCSV}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center space-x-1.5 transition-all cursor-pointer shadow-sm text-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download CSV</span>
                </button>
              )}
              <button onClick={() => setNotification(null)} className="font-bold underline text-gray-500 cursor-pointer">
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Full-Width Analytics Summary Cards (5-Column Wide Grid) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {/* Total Links */}
          <div className="group relative bg-white p-5 rounded-2xl border border-gray-200 hover:border-gray-400 hover:shadow-md transition-all space-y-1 text-center cursor-pointer">
            <div className="opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-gray-900 text-white rounded-xl shadow-2xl border border-gray-700 text-xs z-50 text-left">
              <div className="font-bold text-gray-300 mb-1 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-gray-400" />
                <span>Total Links Formula</span>
              </div>
              <div className="font-mono text-[10px] bg-gray-800 p-1 rounded text-gray-200 mb-1 border border-gray-700">
                COUNT(survey_tokens)
              </div>
              <p className="text-[11px] text-gray-300 leading-snug">
                Total number of unique survey access links generated across all batch runs.
              </p>
            </div>

            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center justify-center gap-1">
              Total Links
              <Info className="w-3 h-3 text-gray-400" />
            </span>
            <div className="text-3xl font-black text-gray-900">{totalLinks.toLocaleString()}</div>
          </div>

          {/* Batches Created */}
          <div className="group relative bg-white p-5 rounded-2xl border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all space-y-1 text-center cursor-pointer">
            <div className="opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-gray-900 text-white rounded-xl shadow-2xl border border-gray-700 text-xs z-50 text-left">
              <div className="font-bold text-purple-400 mb-1 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-purple-400" />
                <span>Batches Formula</span>
              </div>
              <div className="font-mono text-[10px] bg-gray-800 p-1 rounded text-gray-200 mb-1 border border-gray-700">
                COUNT(DISTINCT generated_at)
              </div>
              <p className="text-[11px] text-gray-300 leading-snug">
                Total number of batch token generation runs executed by administrators.
              </p>
            </div>

            <span className="text-xs font-bold text-purple-600 uppercase tracking-wider flex items-center justify-center gap-1">
              Batches Created
              <Info className="w-3 h-3 text-purple-500" />
            </span>
            <div className="text-3xl font-black text-purple-600">{batches.length.toLocaleString()}</div>
          </div>

          {/* Pending */}
          <div className="group relative bg-white p-5 rounded-2xl border border-gray-200 hover:border-amber-300 hover:shadow-md transition-all space-y-1 text-center cursor-pointer">
            <div className="opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-gray-900 text-white rounded-xl shadow-2xl border border-gray-700 text-xs z-50 text-left">
              <div className="font-bold text-amber-400 mb-1 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-amber-400" />
                <span>Pending Formula</span>
              </div>
              <div className="font-mono text-[10px] bg-gray-800 p-1 rounded text-gray-200 mb-1 border border-gray-700">
                COUNT(status = 'pending')
              </div>
              <p className="text-[11px] text-gray-300 leading-snug">
                Links generated but not yet opened by the customer.
              </p>
            </div>

            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider flex items-center justify-center gap-1">
              Pending
              <Info className="w-3 h-3 text-amber-500" />
            </span>
            <div className="text-3xl font-black text-amber-600">{pendingCount.toLocaleString()}</div>
          </div>

          {/* Opened */}
          <div className="group relative bg-white p-5 rounded-2xl border border-gray-200 hover:border-emerald-300 hover:shadow-md transition-all space-y-1 text-center cursor-pointer">
            <div className="opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-gray-900 text-white rounded-xl shadow-2xl border border-gray-700 text-xs z-50 text-left">
              <div className="font-bold text-emerald-400 mb-1 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-emerald-400" />
                <span>Opened Formula</span>
              </div>
              <div className="font-mono text-[10px] bg-gray-800 p-1 rounded text-gray-200 mb-1 border border-gray-700">
                COUNT(status = 'opened')
              </div>
              <p className="text-[11px] text-gray-300 leading-snug">
                Links opened by recipients currently in progress of answering.
              </p>
            </div>

            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider flex items-center justify-center gap-1">
              Opened
              <Info className="w-3 h-3 text-emerald-500" />
            </span>
            <div className="text-3xl font-black text-emerald-600">{openedCount.toLocaleString()}</div>
          </div>

          {/* Completed */}
          <div className="group relative bg-white p-5 rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all space-y-1 text-center cursor-pointer">
            <div className="opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-gray-900 text-white rounded-xl shadow-2xl border border-gray-700 text-xs z-50 text-left">
              <div className="font-bold text-blue-400 mb-1 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-blue-400" />
                <span>Completed Formula</span>
              </div>
              <div className="font-mono text-[10px] bg-gray-800 p-1 rounded text-gray-200 mb-1 border border-gray-700">
                COUNT(status = 'completed')
              </div>
              <p className="text-[11px] text-gray-300 leading-snug">
                Links where the recipient fully completed and submitted their survey.
              </p>
            </div>

            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center justify-center gap-1">
              Completed
              <Info className="w-3 h-3 text-blue-500" />
            </span>
            <div className="text-3xl font-black text-blue-600">{completedCount.toLocaleString()}</div>
          </div>
        </div>

        {/* Batch Generation History Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-5 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold uppercase tracking-wide text-gray-800">
                Batch Generation History ({batches.length} Batches)
              </h2>
            </div>
            <button
              onClick={loadData}
              className="text-sm font-semibold text-gray-600 hover:text-gray-900 flex items-center space-x-1.5 cursor-pointer transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>

          {loading ? (
            <div className="p-12 text-center text-gray-500 font-semibold text-sm">
              Loading generation history...
            </div>
          ) : batches.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <KeyRound className="w-10 h-10 text-gray-300 mx-auto" />
              <p className="text-base font-semibold text-gray-700">No generation batches created yet.</p>
              <p className="text-sm text-gray-500">
                Enter quantity above and click <strong>"Generate"</strong> to create your first batch of survey links.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-xs sm:text-sm font-bold uppercase text-gray-600">
                    <th className="py-4 px-5">Batch</th>
                    <th className="py-4 px-5">Generated At</th>
                    <th className="py-4 px-5 text-center">Links Quantity</th>
                    <th className="py-4 px-5">Status Breakdown</th>
                    <th className="py-4 px-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {batches.map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-4 px-5 font-bold text-gray-900 text-sm sm:text-base">
                        Batch #{b.batchNumber}
                      </td>
                      <td className="py-4 px-5 text-gray-800 font-semibold text-sm sm:text-base">
                        {b.timestamp}
                      </td>
                      <td className="py-4 px-5 font-bold text-gray-900 text-base sm:text-lg text-center">
                        {b.count.toLocaleString()}
                      </td>
                      <td className="py-4 px-5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-3 py-1 rounded-md text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-200">
                            {b.pendingCount} Pending
                          </span>
                          {b.openedCount > 0 && (
                            <span className="px-3 py-1 rounded-md text-xs font-semibold bg-emerald-100 text-emerald-900 border border-emerald-200">
                              {b.openedCount} Opened
                            </span>
                          )}
                          {b.completedCount > 0 && (
                            <span className="px-3 py-1 rounded-md text-xs font-semibold bg-blue-100 text-blue-900 border border-blue-200">
                              {b.completedCount} Completed
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-5 text-right">
                        <button
                          onClick={handleDownloadCSV}
                          className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-xs sm:text-sm font-bold rounded-lg inline-flex items-center space-x-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
                          title="Export all generated survey links CSV"
                        >
                          <Download className="w-4 h-4" />
                          <span>Export CSV</span>
                        </button>
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
