'use client';

import React, { useState } from 'react';
import { ConflictCase } from '../types';
import { 
  Scale, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Calendar, 
  Clock, 
  AlertTriangle,
  RotateCw
} from 'lucide-react';

interface ConflictResolutionViewProps {
  conflicts: ConflictCase[];
  onRefresh: () => void;
}

export const ConflictResolutionView: React.FC<ConflictResolutionViewProps> = ({
  conflicts,
  onRefresh,
}) => {
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [resolvedPlans, setResolvedPlans] = useState<Record<string, any>>({});
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleRunResolution = async (conflict: ConflictCase) => {
    setResolvingId(conflict.id);
    setStatusMessage(null);

    try {
      const response = await fetch('/api/conflicts/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          equipmentId: conflict.equipmentId,
          bookingIds: conflict.contenders.map(c => c.bookingId),
        }),
      });

      const res = await response.json();
      if (!response.ok) {
        throw new Error(res.error || 'Resolution failed');
      }

      setResolvedPlans(prev => ({
        ...prev,
        [conflict.id]: res.data,
      }));
      setStatusMessage('AI Fair Allocation generated and applied to campus schedule.');
      onRefresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error resolving conflict';
      setStatusMessage(`Error: ${msg}`);
    } finally {
      setResolvingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-slate-900 border border-blue-800/40 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs font-semibold text-blue-400">
              <Scale className="w-4 h-4" />
              <span>Intelligent Resource Optimization</span>
            </div>
            <h2 className="text-2xl font-bold text-white">
              AI Scheduling Conflict Resolution Engine
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              When student slot requests overlap for high-demand lab equipment, LabLink’s AI evaluates project deadlines, urgency tiers, and historical fairness to propose optimal, non-disruptive schedule allocations.
            </p>
          </div>

          <div className="flex items-center space-x-3 self-stretch sm:self-auto">
            <button
              onClick={onRefresh}
              className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Refresh Conflicts</span>
            </button>
          </div>
        </div>

        {statusMessage && (
          <div className="mt-4 p-3 rounded-xl bg-blue-950/80 border border-blue-700 text-blue-200 text-xs flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}
      </div>

      {/* Conflict Cases */}
      {conflicts.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/60 rounded-3xl border border-slate-800 p-8">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">Zero Scheduling Bottlenecks</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            All active laboratory bookings have been assigned conflict-free slots across all campus departments.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {conflicts.map((conflict) => {
            const plan = resolvedPlans[conflict.id] || (conflict.aiRecommendation ? {
              winningBooking: {
                studentName: conflict.aiRecommendation.preferredStudentName,
              },
              winningScore: conflict.aiRecommendation.fairnessScore,
              resolutionJustification: conflict.aiRecommendation.reasoning,
              runnerUps: [
                {
                  booking: { studentName: conflict.aiRecommendation.suggestedAlternative.studentName },
                  recommendedAlternative: {
                    equipmentName: conflict.aiRecommendation.suggestedAlternative.alternativeEquipmentName,
                    suggestedSlot: conflict.aiRecommendation.suggestedAlternative.alternativeSlot,
                    explanation: conflict.aiRecommendation.suggestedAlternative.compromiseReason,
                  }
                }
              ]
            } : null);

            return (
              <div 
                key={conflict.id}
                className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl"
              >
                {/* Header */}
                <div className="p-6 border-b border-slate-800 bg-slate-950/60 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-950/80 text-rose-300 border border-rose-800 flex items-center">
                        <AlertTriangle className="w-3.5 h-3.5 mr-1" /> Overlap Detected
                      </span>
                      <span className="text-xs text-slate-400 font-mono">Case #{conflict.id}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white">
                      {conflict.equipmentName}
                    </h3>
                    <p className="text-xs text-slate-400 flex items-center mt-1">
                      <Calendar className="w-3.5 h-3.5 mr-1 text-slate-500" />
                      Date: <strong className="text-slate-200 ml-1 mr-3">{conflict.date}</strong>
                      <Clock className="w-3.5 h-3.5 mr-1 text-slate-500" />
                      Contested Window: <strong className="text-slate-200 ml-1">{conflict.timeSlot}</strong>
                    </p>
                  </div>

                  <button
                    onClick={() => handleRunResolution(conflict)}
                    disabled={resolvingId === conflict.id}
                    className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50"
                  >
                    <Sparkles className="w-4 h-4 text-cyan-300" />
                    <span>{resolvingId === conflict.id ? 'Optimizing Allocation...' : 'Run AI Fair Allocation'}</span>
                  </button>
                </div>

                {/* Contenders Side-by-Side Comparison */}
                <div className="p-6">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                    Competing Access Requests ({conflict.contenders.length}):
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {conflict.contenders.map((contender, idx) => (
                      <div 
                        key={idx}
                        className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-bold text-white">
                              {contender.studentName}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                              contender.urgency === 'Critical Capstone'
                                ? 'bg-rose-950/80 text-rose-300 border border-rose-800'
                                : contender.urgency === 'High'
                                ? 'bg-amber-950/80 text-amber-300 border border-amber-800'
                                : 'bg-slate-800 text-slate-300'
                            }`}>
                              {contender.urgency}
                            </span>
                          </div>

                          <p className="text-xs text-slate-400 mb-1">
                            <strong>Dept:</strong> {contender.department} • <span className="font-mono">{contender.studentEmail}</span>
                          </p>
                          <p className="text-xs text-slate-300 font-medium mb-3">
                            "{contender.projectTitle}"
                          </p>
                        </div>

                        <div className="border-t border-slate-800/80 pt-2 grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-slate-500 block text-[11px]">Milestone Deadline:</span>
                            <span className="text-amber-300 font-semibold">{contender.projectDeadline}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[11px]">Prior Hours This Week:</span>
                            <span className="text-slate-300 font-semibold">{contender.priorHoursThisWeek} hrs</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* AI Resolution Plan Output */}
                  {plan && (
                    <div className="mt-6 p-5 rounded-2xl bg-gradient-to-br from-blue-950/50 via-indigo-950/30 to-slate-950 border border-blue-800/50">
                      <div className="flex items-center space-x-2 text-xs font-bold text-blue-300 mb-2">
                        <Sparkles className="w-4 h-4 text-cyan-400" />
                        <span>AI Fair & Feasible Allocation Recommendation</span>
                        <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[11px]">
                          Fairness Score: {plan.winningScore}/100
                        </span>
                      </div>

                      <p className="text-xs text-slate-200 leading-relaxed mb-4">
                        {plan.resolutionJustification}
                      </p>

                      {plan.runnerUps && plan.runnerUps.length > 0 && (
                        <div className="border-t border-blue-900/60 pt-3">
                          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                            Fair Alternate Allocation for {plan.runnerUps[0].booking?.studentName}:
                          </p>
                          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start space-x-3 text-xs">
                            <ArrowRight className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                            <div>
                              <p className="font-semibold text-white">
                                Recommended Slot: <span className="text-cyan-300">{plan.runnerUps[0].recommendedAlternative.suggestedSlot}</span>
                              </p>
                              <p className="text-slate-300 text-xs mt-0.5">
                                {plan.runnerUps[0].recommendedAlternative.explanation}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
