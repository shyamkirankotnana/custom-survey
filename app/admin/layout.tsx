'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, KeyRound, MessageSquareText, ShieldCheck, Menu, X, ExternalLink, RefreshCw } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    {
      label: 'Analytics Dashboard',
      href: '/admin/analytics',
      icon: BarChart3,
      description: 'NPS, CES & Funnel Metrics',
    },
    {
      label: 'Token Generator',
      href: '/admin/tokens',
      icon: KeyRound,
      description: 'Generate & Export Survey Links',
    },
    {
      label: 'Responses Explorer',
      href: '/admin/responses',
      icon: MessageSquareText,
      description: 'Inspect Submissions & Data',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      {/* Shared Admin Header Navigation */}
      <header className="bg-gray-900 text-white border-b border-gray-800 sticky top-0 z-50 shadow-md">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Brand Logo & Title */}
            <div className="flex items-center space-x-3">
              <Link href="/admin/analytics" className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white shadow-md group-hover:bg-orange-600 transition-colors">
                  <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-base tracking-tight text-white">ICICI Bank</span>
                    <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                      Admin Portal
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 leading-none">Survey Management Suite</p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== '/admin/analytics' && pathname?.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                      isActive
                        ? 'bg-orange-500 text-white shadow-md scale-[1.02]'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800/80'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right Quick Actions */}
            <div className="hidden sm:flex items-center space-x-3">
              <Link
                href="/s/testtoken"
                target="_blank"
                className="text-xs font-semibold text-gray-400 hover:text-white flex items-center space-x-1 px-3 py-1.5 rounded-lg hover:bg-gray-800 transition-all border border-transparent hover:border-gray-700"
              >
                <span>Test Survey UI</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Mobile Hamburger Toggle */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-gray-300 hover:text-white hover:bg-gray-800 focus:outline-none"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-gray-900 border-b border-gray-800 px-4 pt-2 pb-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/admin/analytics' && pathname?.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                  <div>
                    <div>{item.label}</div>
                    <div className="text-[10px] font-normal text-gray-400">{item.description}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* Main Admin Page Content */}
      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  );
}
