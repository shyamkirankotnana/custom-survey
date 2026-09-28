'use client';

import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, RefreshCw, Smile, Meh, Frown, Filter, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AdminAnalyticsPage() {
  const [nps, setNps] = useState<any>({ promoters: 0, passives: 0, detractors: 0, total_responses: 0, nps_score: 0 });
  const [funnel, setFunnel] = useState<any>({ generated_links: 0, opened_links: 0, completed_responses: 0, open_rate: 0, completion_rate: 0 });
  const [loading, setLoading] = useState(true);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/analytics');
      if (res.ok) {
        const data = await res.json();
        setNps(data.nps || {});
        setFunnel(data.funnel || {});
      }
    } catch (err) {
      console.error('Error loading analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const total = nps.total_responses || 0;
  const promoterPct = total > 0 ? Math.round((nps.promoters / total) * 100) : 0;
  const passivePct = total > 0 ? Math.round((nps.passives / total) * 100) : 0;
  const detractorPct = total > 0 ? Math.round((nps.detractors / total) * 100) : 0;

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans text-gray-900">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Header Bar */}
        <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-orange-500 rounded-xl">
              <BarChart3 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">NPS Analytics Engine</h1>
              <p className="text-xs text-gray-400">Phase 5: Performance Metrics & Sentiment Breakdown</p>
            </div>
          </div>

          <button
            onClick={loadAnalytics}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 active:scale-95 text-white text-xs font-bold rounded-xl flex items-center space-x-2 border border-gray-700 transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Analytics</span>
          </button>
        </div>

        {/* Master NPS Score Hero Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <span className="text-xs font-extrabold uppercase tracking-wider text-gray-500">
                Net Promoter Score (NPS)
              </span>
            </div>
            <div className="text-5xl sm:text-6xl font-black text-gray-900">
              {nps.nps_score > 0 ? `+${nps.nps_score}` : nps.nps_score}
            </div>
            <p className="text-xs text-gray-500 font-medium">
              Formula: <code className="font-mono text-gray-800 font-bold">% Promoters - % Detractors</code>
            </p>
          </div>

          {/* Quick Sentiment Bar */}
          <div className="w-full md:w-80 space-y-3">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-emerald-700">Promoters ({promoterPct}%)</span>
              <span className="text-amber-700">Passives ({passivePct}%)</span>
              <span className="text-red-700">Detractors ({detractorPct}%)</span>
            </div>

            <div className="h-3.5 w-full bg-gray-100 rounded-full overflow-hidden flex shadow-inner">
              <div style={{ width: `${promoterPct}%` }} className="bg-emerald-500 h-full" title="Promoters" />
              <div style={{ width: `${passivePct}%` }} className="bg-amber-400 h-full" title="Passives" />
              <div style={{ width: `${detractorPct}%` }} className="bg-red-500 h-full" title="Detractors" />
            </div>

            <div className="text-right text-[11px] text-gray-400 font-mono">
              Based on {total} total responses
            </div>
          </div>
        </div>

        {/* Sentiment breakdown cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Promoters */}
          <div className="bg-emerald-50/60 border border-emerald-200 p-5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase text-emerald-800 tracking-wider">Promoters (9-10)</span>
              <Smile className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="text-3xl font-black text-emerald-900">{nps.promoters}</div>
            <div className="text-xs font-semibold text-emerald-700">{promoterPct}% of total responses</div>
          </div>

          {/* Passives */}
          <div className="bg-amber-50/60 border border-amber-200 p-5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase text-amber-800 tracking-wider">Passives (7-8)</span>
              <Meh className="w-5 h-5 text-amber-600" />
            </div>
            <div className="text-3xl font-black text-amber-900">{nps.passives}</div>
            <div className="text-xs font-semibold text-amber-700">{passivePct}% of total responses</div>
          </div>

          {/* Detractors */}
          <div className="bg-red-50/60 border border-red-200 p-5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase text-red-800 tracking-wider">Detractors (0-6)</span>
              <Frown className="w-5 h-5 text-red-600" />
            </div>
            <div className="text-3xl font-black text-red-900">{nps.detractors}</div>
            <div className="text-xs font-semibold text-red-700">{detractorPct}% of total responses</div>
          </div>
        </div>

        {/* Funnel Performance Metrics Section */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-gray-700">
              Funnel Performance Metrics
            </h2>
            <span className="text-xs bg-blue-50 text-blue-700 font-bold px-3 py-1 rounded-full border border-blue-200">
              Live Token Funnel
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-1">
              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Generated Links</span>
              <div className="text-2xl font-black text-gray-900">{funnel.generated_links}</div>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-1">
              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Opened Links</span>
              <div className="text-2xl font-black text-blue-600">{funnel.opened_links}</div>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-1">
              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Completed</span>
              <div className="text-2xl font-black text-emerald-600">{funnel.completed_responses}</div>
            </div>

            <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200 space-y-1">
              <span className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider">Open Rate</span>
              <div className="text-2xl font-black text-amber-700">{funnel.open_rate}%</div>
            </div>

            <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-1 col-span-2 sm:col-span-1">
              <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">Completion Rate</span>
              <div className="text-2xl font-black text-emerald-700">{funnel.completion_rate}%</div>
            </div>
          </div>
        </div>

        {/* Quick Portal Nav Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <Link
            href="/admin/responses"
            className="text-xs font-bold text-gray-600 hover:text-gray-900 flex items-center space-x-1"
          >
            <span>← Go to Responses Dashboard</span>
          </Link>

          <Link
            href="/admin/tokens"
            className="text-xs font-bold text-orange-600 hover:underline flex items-center space-x-1"
          >
            <span>Go to Token Generator →</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
