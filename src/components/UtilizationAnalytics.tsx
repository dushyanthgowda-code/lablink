'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Activity, 
  Layers, 
  AlertOctagon, 
  Clock, 
  TrendingUp, 
  Building 
} from 'lucide-react';

export const UtilizationAnalytics: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics')
      .then(res => res.json())
      .then(json => {
        if (json.success) setData(json.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="py-20 text-center text-xs text-slate-400">
        Loading Campus Analytics...
      </div>
    );
  }

  const { metrics, departmentBreakdown, topBottlenecks } = data;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-cyan-900/40 via-blue-900/40 to-slate-900 border border-cyan-800/40 rounded-3xl p-6 sm:p-8">
        <div className="flex items-center space-x-2 text-xs font-semibold text-cyan-400 mb-2">
          <BarChart3 className="w-4 h-4" />
          <span>Real-Time Resource Telemetry</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Campus Laboratory Utilization & Efficiency
        </h2>
        <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
          Comprehensive cross-department telemetry tracking hardware uptime, peak booking hours, and capacity bottlenecks across all research wings.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Campus Utilization</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white">
            {metrics.averageCampusUtilization}%
          </div>
          <p className="text-[11px] text-emerald-400 mt-1 flex items-center">
            <TrendingUp className="w-3 h-3 mr-1" /> Optimal balanced range
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Active Bookings</span>
            <Layers className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-black text-white">
            {metrics.activeBookingsCount}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Across 6 departments</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Active Conflicts</span>
            <AlertOctagon className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-white">
            {metrics.activeConflictsCount}
          </div>
          <p className="text-[11px] text-amber-400 mt-1">Managed by AI engine</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Shared Equipment</span>
            <Building className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-black text-white">
            {metrics.totalEquipmentCount}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Online & verified</p>
        </div>
      </div>

      {/* Department Breakdown & Bottlenecks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Progress Bars */}
        <div className="lg:col-span-2 bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-xl">
          <h3 className="text-base font-bold text-white mb-4 flex items-center">
            <Activity className="w-4 h-4 text-blue-400 mr-2" />
            Cross-Department Utilization Index
          </h3>
          <div className="space-y-4">
            {departmentBreakdown.map((dept: any) => (
              <div key={dept.department} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">{dept.department} Department</span>
                  <span className="text-slate-400 font-mono">
                    {dept.utilizationRate}% ({dept.activeBookings} active slots)
                  </span>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      dept.utilizationRate >= 90
                        ? 'bg-rose-500'
                        : dept.utilizationRate >= 75
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${dept.utilizationRate}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" /> Peak: {dept.peakHours}
                  </span>
                  <span>Equipment: {dept.totalEquipment} units</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottleneck Alerts */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white mb-1 flex items-center">
              <AlertOctagon className="w-4 h-4 text-amber-400 mr-2" />
              High-Demand Bottlenecks
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Resources with waitlists exceeding 48 hours.
            </p>

            <div className="space-y-3">
              {topBottlenecks.map((item: any, idx: number) => (
                <div 
                  key={idx} 
                  className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">{item.name}</h4>
                    <p className="text-[11px] text-slate-400">{item.department} Dept</p>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded-full bg-rose-950/80 text-rose-300 border border-rose-800 text-[10px] font-bold">
                      {item.utilization}% load
                    </span>
                    <span className="block text-[10px] text-slate-500 mt-0.5">
                      ~{item.waitlistDays}d waitlist
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-3 rounded-2xl bg-blue-950/40 border border-blue-800/40 text-blue-300 text-xs leading-relaxed">
            💡 <strong>AI Resource Advisory:</strong> High DGX cluster load can be mitigated by recommending student model training on idle Jetson Orin nodes during 09:00 - 13:00.
          </div>
        </div>
      </div>
    </div>
  );
};
