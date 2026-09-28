'use client';

import React, { useState, useEffect } from 'react';
import { Database, Download, FileJson, Search, Eye, RefreshCw, CheckCircle2, Clock, MessageSquareText } from 'lucide-react';
import Link from 'next/link';

export default function AdminResponsesPage() {
  const [responses, setResponses] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/responses/list');
      if (res.ok) {
        const data = await res.json();
        setResponses(data.responses || []);
        setSummary(data.summary || {});
      }
    } catch (err) {
      console.error('Error loading responses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredResponses = responses.filter((r) => {
    const token = r.survey_tokens?.token || '';
    const nps = String(r.response_json?.npsScore ?? '');
    const searchLower = searchQuery.toLowerCase();
    return token.toLowerCase().includes(searchLower) || nps.includes(searchLower);
  });

  const totalTokens = summary.total_tokens || 1;
  const totalCompleted = summary.total_completed || summary.total_responses || 0;
  const responseRate = totalTokens > 0 ? Math.round((totalCompleted / totalTokens) * 100) : 0;

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans text-gray-900">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Header Bar */}
        <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-emerald-500 rounded-xl">
              <MessageSquareText className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Responses Dashboard</h1>
              <p className="text-xs text-gray-400">Response Management & Analytics Foundation</p>
            </div>
          </div>

          {/* Export Actions */}
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <a
              href="/api/admin/responses/export/csv"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-sm rounded-xl flex items-center justify-center space-x-2 transition-all shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </a>

            <a
              href="/api/admin/responses/export/json"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none px-4 py-2.5 bg-gray-800 hover:bg-gray-700 active:scale-95 text-white font-extrabold text-sm rounded-xl flex items-center justify-center space-x-2 transition-all border border-gray-700"
            >
              <FileJson className="w-4 h-4" />
              <span>Export JSON</span>
            </a>
          </div>
        </div>

        {/* Summary Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-1">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Responses</span>
            <div className="text-2xl font-black text-gray-900">{summary.total_responses || responses.length}</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-1">
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Completed Today</span>
            <div className="text-2xl font-black text-emerald-600">{summary.completed_today || 0}</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-1">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Total Tokens</span>
            <div className="text-2xl font-black text-blue-600">{summary.total_tokens || 0}</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-1">
            <span className="text-xs font-semibold text-orange-600 uppercase tracking-wider">Response Rate</span>
            <div className="text-2xl font-black text-orange-600">{responseRate}%</div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by token or score..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <button
            onClick={loadData}
            className="text-xs font-semibold text-gray-500 hover:text-gray-900 flex items-center space-x-1.5 self-end sm:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh List</span>
          </button>
        </div>

        {/* Responses Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-gray-700">
              Submitted Responses ({filteredResponses.length})
            </h2>
            <Link href="/admin/tokens" className="text-xs font-bold text-orange-600 hover:underline">
              View Token Generator →
            </Link>
          </div>

          {loading ? (
            <div className="p-12 text-center text-gray-400 font-semibold text-xs">
              Loading responses from Supabase...
            </div>
          ) : filteredResponses.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <Database className="w-8 h-8 text-gray-300 mx-auto" />
              <p className="text-sm font-semibold text-gray-600">No survey responses submitted yet.</p>
              <p className="text-xs text-gray-400">
                Complete a survey via <code className="font-mono text-orange-600">/s/[token]</code> to generate your first response record.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-[11px] font-extrabold uppercase text-gray-500">
                    <th className="py-3 px-4">Response ID</th>
                    <th className="py-3 px-4">Token</th>
                    <th className="py-3 px-4">NPS</th>
                    <th className="py-3 px-4">Resolution Ease</th>
                    <th className="py-3 px-4">Submitted At</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {filteredResponses.map((r) => {
                    const token = r.survey_tokens?.token || 'N/A';
                    const nps = r.response_json?.npsScore;
                    const ease = r.response_json?.resolutionEase;

                    return (
                      <tr key={r.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-3 px-4 font-mono text-gray-500 font-bold">
                          {r.id.substring(0, 8)}...
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-gray-900">
                          <Link href={`/s/${token}`} target="_blank" className="hover:text-orange-600 hover:underline">
                            {token}
                          </Link>
                        </td>
                        <td className="py-3 px-4">
                          {nps !== undefined && nps !== null ? (
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                                nps >= 9
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : nps >= 7
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              NPS {nps}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-medium text-gray-700">{ease || '-'}</td>
                        <td className="py-3 px-4 text-gray-400 font-mono text-[11px]">
                          {new Date(r.submitted_at).toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Link
                            href={`/admin/responses/${r.id}`}
                            className="inline-flex items-center space-x-1 text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-lg border border-orange-200 transition-all"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Inspect JSON</span>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
