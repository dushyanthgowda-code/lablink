'use client';

import React from 'react';
import { 
  Compass, 
  Calendar, 
  Scale, 
  BarChart3, 
  Bot, 
  ShieldCheck, 
  UserCheck 
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: 'student' | 'faculty';
  setUserRole: (role: 'student' | 'faculty') => void;
  pendingApprovalsCount: number;
  activeConflictsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  userRole,
  setUserRole,
  pendingApprovalsCount,
  activeConflictsCount,
}) => {
  const navItems = [
    { id: 'discover', label: 'Discover Equipment', icon: Compass },
    { id: 'bookings', label: 'My Bookings', icon: Calendar },
    { 
      id: 'conflicts', 
      label: 'AI Conflict Hub', 
      icon: Scale, 
      badge: activeConflictsCount > 0 ? activeConflictsCount : null 
    },
    { 
      id: 'faculty', 
      label: 'Faculty Approvals', 
      icon: ShieldCheck, 
      badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : null,
      adminOnly: true 
    },
    { id: 'analytics', label: 'Campus Analytics', icon: BarChart3 },
    { id: 'copilot', label: 'LabLink Copilot', icon: Bot },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-900/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Compass className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight text-white">LabLink</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-medium border border-blue-500/30">
                  GenAI Platform
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Campus Laboratory Resource Sharing</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex space-x-1" aria-label="Main Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  <span>{item.label}</span>
                  {item.badge !== null && item.badge !== undefined && (
                    <span className="ml-1.5 px-1.5 py-0.5 text-xs rounded-full bg-amber-500/90 text-slate-950 font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Role Switcher Pill */}
          <div className="flex items-center space-x-2 bg-slate-800 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setUserRole('student')}
              aria-label="Switch to Student view"
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                userRole === 'student'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserCheck className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Student</span>
            </button>
            <button
              onClick={() => setUserRole('faculty')}
              aria-label="Switch to Faculty / Lab Manager view"
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                userRole === 'faculty'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Faculty</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex overflow-x-auto py-2 space-x-2 border-t border-slate-800">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md text-xs whitespace-nowrap font-medium ${
                  isActive ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="px-1 py-0.2 bg-amber-500 text-slate-950 font-bold rounded-full text-[10px]">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
