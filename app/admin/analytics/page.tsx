'use client';

import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, RefreshCw, Smile, Meh, Frown, Filter, ArrowRight, Info } from 'lucide-react';
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
        <div className="group relative bg-white rounded-2xl border border-gray-200 shadow-sm hover:border-orange-300 hover:shadow-md transition-all p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Tooltip Popover */}
          <div className="opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 absolute -top-16 left-1/2 -translate-x-1/2 w-80 p-3 bg-gray-900 text-white rounded-xl shadow-2xl border border-gray-700 text-xs z-50">
            <div className="font-bold text-orange-400 mb-1 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-orange-400" />
              <span>How NPS is Calculated</span>
            </div>
            <div className="text-[11px] font-semibold bg-gray-800 p-1.5 rounded text-gray-200 mb-1.5 border border-gray-700">
              % Promoters minus % Detractors
            </div>
            <p className="text-[11px] text-gray-300 leading-snug">
              Out of all customer responses, we take the percentage of happy promoters (scores 9–10) and subtract the percentage of unhappy detractors (scores 0–6).
            </p>
          </div>

          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <span className="text-xs font-extrabold uppercase tracking-wider text-gray-500 flex items-center gap-1">
                Net Promoter Score (NPS)
                <Info className="w-3.5 h-3.5 text-gray-400" />
              </span>
            </div>
            <div className="text-5xl sm:text-6xl font-black text-gray-900">
              {nps.nps_score > 0 ? `+${nps.nps_score}` : nps.nps_score}
            </div>
            <p className="text-xs text-gray-500 font-medium">
              Calculation: <span className="text-gray-800 font-bold">% Promoters - % Detractors</span>
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
              <div style={{ width: `${promoterPct}%` }} className="bg-emerald-500 h-full" title="Promoters (Score 9-10)" />
              <div style={{ width: `${passivePct}%` }} className="bg-amber-400 h-full" title="Passives (Score 7-8)" />
              <div style={{ width: `${detractorPct}%` }} className="bg-red-500 h-full" title="Detractors (Score 0-6)" />
            </div>

            <div className="text-right text-[11px] text-gray-400 font-mono">
              Based on {total} total responses
            </div>
          </div>
        </div>

        {/* Sentiment breakdown cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Promoters */}
          <div className="group relative bg-emerald-50/60 border border-emerald-200 hover:border-emerald-400 hover:shadow-md transition-all p-5 rounded-2xl space-y-2 cursor-pointer">
            <div className="opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3 bg-gray-900 text-white rounded-xl shadow-2xl border border-gray-700 text-xs z-50">
              <div className="font-bold text-emerald-400 mb-1 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-emerald-400" />
                <span>Promoters (Score 9 or 10)</span>
              </div>
              <div className="text-[11px] font-semibold bg-gray-800 p-1.5 rounded text-gray-200 mb-1.5 border border-gray-700">
                Count of ratings 9 & 10
              </div>
              <p className="text-[11px] text-gray-300 leading-snug">
                These are your most satisfied customers who are highly likely to recommend ICICI Bank to friends and colleagues.
              </p>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase text-emerald-800 tracking-wider flex items-center gap-1">
                Promoters (9-10)
                <Info className="w-3.5 h-3.5 text-emerald-600" />
              </span>
              <Smile className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="text-3xl font-black text-emerald-900">{nps.promoters}</div>
            <div className="text-xs font-semibold text-emerald-700">{promoterPct}% of total responses</div>
          </div>

          {/* Passives */}
          <div className="group relative bg-amber-50/60 border border-amber-200 hover:border-amber-400 hover:shadow-md transition-all p-5 rounded-2xl space-y-2 cursor-pointer">
            <div className="opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3 bg-gray-900 text-white rounded-xl shadow-2xl border border-gray-700 text-xs z-50">
              <div className="font-bold text-amber-400 mb-1 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-amber-400" />
                <span>Passives (Score 7 or 8)</span>
              </div>
              <div className="text-[11px] font-semibold bg-gray-800 p-1.5 rounded text-gray-200 mb-1.5 border border-gray-700">
                Count of ratings 7 & 8
              </div>
              <p className="text-[11px] text-gray-300 leading-snug">
                These customers had a satisfactory experience but are neutral. They do not add to or subtract from your Net Promoter Score.
              </p>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase text-amber-800 tracking-wider flex items-center gap-1">
                Passives (7-8)
                <Info className="w-3.5 h-3.5 text-amber-600" />
              </span>
              <Meh className="w-5 h-5 text-amber-600" />
            </div>
            <div className="text-3xl font-black text-amber-900">{nps.passives}</div>
            <div className="text-xs font-semibold text-amber-700">{passivePct}% of total responses</div>
          </div>

          {/* Detractors */}
          <div className="group relative bg-red-50/60 border border-red-200 hover:border-red-400 hover:shadow-md transition-all p-5 rounded-2xl space-y-2 cursor-pointer">
            <div className="opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3 bg-gray-900 text-white rounded-xl shadow-2xl border border-gray-700 text-xs z-50">
              <div className="font-bold text-red-400 mb-1 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-red-400" />
                <span>Detractors (Score 0 to 6)</span>
              </div>
              <div className="text-[11px] font-semibold bg-gray-800 p-1.5 rounded text-gray-200 mb-1.5 border border-gray-700">
                Count of ratings 0 to 6
              </div>
              <p className="text-[11px] text-gray-300 leading-snug">
                These customers were dissatisfied with their experience and directly reduce your overall Net Promoter Score.
              </p>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase text-red-800 tracking-wider flex items-center gap-1">
                Detractors (0-6)
                <Info className="w-3.5 h-3.5 text-red-600" />
              </span>
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
            {/* Generated Links */}
            <div className="group relative p-4 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-100 hover:border-gray-300 transition-all space-y-1 cursor-pointer">
              <div className="opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-gray-900 text-white rounded-xl shadow-2xl border border-gray-700 text-xs z-50 text-left">
                <div className="font-bold text-gray-300 mb-1 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-gray-400" />
                  <span>Generated Links</span>
                </div>
                <div className="text-[11px] font-semibold bg-gray-800 p-1 rounded text-gray-200 mb-1 border border-gray-700">
                  Total survey links created
                </div>
                <p className="text-[11px] text-gray-300 leading-snug">
                  The total number of unique survey links generated by admins across all batches to send out to customers.
                </p>
              </div>

              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider flex items-center justify-center gap-1">
                Generated Links
                <Info className="w-3.5 h-3.5 text-gray-400" />
              </span>
              <div className="text-2xl font-black text-gray-900">{funnel.generated_links}</div>
            </div>

            {/* Opened Links */}
            <div className="group relative p-4 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-100 hover:border-gray-300 transition-all space-y-1 cursor-pointer">
              <div className="opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-gray-900 text-white rounded-xl shadow-2xl border border-gray-700 text-xs z-50 text-left">
                <div className="font-bold text-blue-400 mb-1 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-blue-400" />
                  <span>Opened Links</span>
                </div>
                <div className="text-[11px] font-semibold bg-gray-800 p-1 rounded text-gray-200 mb-1 border border-gray-700">
                  Total links clicked by recipients
                </div>
                <p className="text-[11px] text-gray-300 leading-snug">
                  The total number of survey links that recipients clicked on and opened.
                </p>
              </div>

              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider flex items-center justify-center gap-1">
                Opened Links
                <Info className="w-3.5 h-3.5 text-blue-500" />
              </span>
              <div className="text-2xl font-black text-blue-600">{funnel.opened_links}</div>
            </div>

            {/* Completed */}
            <div className="group relative p-4 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-100 hover:border-gray-300 transition-all space-y-1 cursor-pointer">
              <div className="opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-gray-900 text-white rounded-xl shadow-2xl border border-gray-700 text-xs z-50 text-left">
                <div className="font-bold text-emerald-400 mb-1 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Completed Surveys</span>
                </div>
                <div className="text-[11px] font-semibold bg-gray-800 p-1 rounded text-gray-200 mb-1 border border-gray-700">
                  Total surveys submitted
                </div>
                <p className="text-[11px] text-gray-300 leading-snug">
                  The number of customers who filled out and successfully submitted all required answers in the survey.
                </p>
              </div>

              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider flex items-center justify-center gap-1">
                Completed
                <Info className="w-3.5 h-3.5 text-emerald-500" />
              </span>
              <div className="text-2xl font-black text-emerald-600">{funnel.completed_responses}</div>
            </div>

            {/* Open Rate */}
            <div className="group relative p-4 bg-amber-50/50 hover:bg-amber-100/60 rounded-xl border border-amber-200 transition-all space-y-1 cursor-pointer">
              <div className="opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-gray-900 text-white rounded-xl shadow-2xl border border-gray-700 text-xs z-50 text-left">
                <div className="font-bold text-amber-400 mb-1 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-amber-400" />
                  <span>Open Rate</span>
                </div>
                <div className="text-[11px] font-semibold bg-gray-800 p-1 rounded text-gray-200 mb-1 border border-gray-700">
                  Opened Links ÷ Generated Links
                </div>
                <p className="text-[11px] text-gray-300 leading-snug">
                  Shows what percentage of your created survey links were actually opened by customers.
                </p>
              </div>

              <span className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider flex items-center justify-center gap-1">
                Open Rate
                <Info className="w-3.5 h-3.5 text-amber-600" />
              </span>
              <div className="text-2xl font-black text-amber-700">{funnel.open_rate}%</div>
            </div>

            {/* Completion Rate */}
            <div className="group relative p-4 bg-emerald-50/50 hover:bg-emerald-100/60 rounded-xl border border-emerald-200 transition-all space-y-1 col-span-2 sm:col-span-1 cursor-pointer">
              <div className="opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-gray-900 text-white rounded-xl shadow-2xl border border-gray-700 text-xs z-50 text-left">
                <div className="font-bold text-emerald-400 mb-1 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Completion Rate</span>
                </div>
                <div className="text-[11px] font-semibold bg-gray-800 p-1 rounded text-gray-200 mb-1 border border-gray-700">
                  Completed ÷ Opened Links
                </div>
                <p className="text-[11px] text-gray-300 leading-snug">
                  Shows what percentage of people who opened the link went on to finish the survey.
                </p>
              </div>

              <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider flex items-center justify-center gap-1">
                Completion Rate
                <Info className="w-3.5 h-3.5 text-emerald-600" />
              </span>
              <div className="text-2xl font-black text-emerald-700">{funnel.completion_rate}%</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
