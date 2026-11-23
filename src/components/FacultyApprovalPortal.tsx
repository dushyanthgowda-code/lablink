'use client';

import React, { useState } from 'react';
import { SlotBooking } from '../types';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Calendar, 
  FileText, 
  AlertCircle,
  Building,
  GraduationCap
} from 'lucide-react';

interface FacultyApprovalPortalProps {
  bookings: SlotBooking[];
  onActionComplete: () => void;
}

export const FacultyApprovalPortal: React.FC<FacultyApprovalPortalProps> = ({
  bookings,
  onActionComplete,
}) => {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState<Record<string, string>>({});
  const [showRejectInput, setShowRejectInput] = useState<Record<string, boolean>>({});

  const handleAction = async (bookingId: string, action: 'approve' | 'reject') => {
    setLoadingId(bookingId);
    setFeedbackMessage(null);

    try {
      const response = await fetch('/api/faculty/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId,
          action,
          reason: rejectReason[bookingId] || (action === 'approve' ? 'Approved by Faculty In-Charge' : 'Slot rejected due to prerequisite mismatch'),
        }),
      });

      const res = await response.json();
      if (!response.ok) {
        throw new Error(res.error || 'Action failed');
      }

      setFeedbackMessage(res.message);
      onActionComplete();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error executing faculty action';
      setFeedbackMessage(`Error: ${msg}`);
    } finally {
      setLoadingId(null);
    }
  };

  const pendingBookings = bookings.filter(b => b.status === 'pending_faculty' || b.status === 'conflict_flagged');

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-indigo-900/40 via-purple-900/40 to-slate-900 border border-indigo-800/40 rounded-3xl p-6 sm:p-8">
        <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-400 mb-2">
          <ShieldCheck className="w-4 h-4" />
          <span>Faculty & Lab Administrator Console</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Project-Based Access Approvals & Safety Review
        </h2>
        <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
          Verify academic project alignment, evaluate equipment prerequisites, and grant access to institutional laboratories across campus.
        </p>

        {feedbackMessage && (
          <div className="mt-4 p-3 rounded-xl bg-indigo-950/80 border border-indigo-700 text-indigo-200 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{feedbackMessage}</span>
          </div>
        )}
      </div>

      {/* Bookings List */}
      {pendingBookings.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/60 rounded-3xl border border-slate-800 p-8">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">Queue Clear</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            There are currently no pending student laboratory requests requiring faculty clearance.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingBookings.map((booking) => (
            <div 
              key={booking.id}
              className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-xl flex flex-col justify-between"
            >
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-1.5">
                    <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md">
                      #{booking.id}
                    </span>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                      booking.status === 'conflict_flagged'
                        ? 'bg-amber-950/80 text-amber-300 border border-amber-800'
                        : 'bg-blue-950/80 text-blue-300 border border-blue-800'
                    }`}>
                      {booking.status === 'conflict_flagged' ? 'AI Conflict Pending' : 'Pending Faculty Review'}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      booking.urgencyLevel === 'Critical Capstone'
                        ? 'bg-rose-950/80 text-rose-300 border border-rose-800'
                        : booking.urgencyLevel === 'High'
                        ? 'bg-amber-950/80 text-amber-300 border border-amber-800'
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {booking.urgencyLevel}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white">
                    {booking.equipmentName}
                  </h3>
                  <p className="text-xs text-slate-400 flex items-center mt-1">
                    <Building className="w-3.5 h-3.5 mr-1 text-slate-500" />
                    Department: <strong className="text-slate-200 ml-1 mr-3">{booking.department}</strong>
                    <GraduationCap className="w-3.5 h-3.5 mr-1 text-slate-500" />
                    Guide: <strong className="text-slate-200 ml-1">{booking.facultyGuide}</strong>
                  </p>
                </div>

                <div className="text-right text-xs text-slate-400">
                  <div className="flex items-center space-x-1.5 text-slate-200 font-semibold">
                    <Calendar className="w-3.5 h-3.5 text-blue-400" />
                    <span>{booking.date}</span>
                    <Clock className="w-3.5 h-3.5 text-blue-400 ml-2" />
                    <span>{booking.startTime} - {booking.endTime}</span>
                  </div>
                  <p className="mt-1 text-[11px] text-amber-400">
                    Deadline: <strong>{booking.projectDeadline}</strong>
                  </p>
                </div>
              </div>

              {/* Project Details */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 mb-5">
                <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-300 mb-1">
                  <FileText className="w-3.5 h-3.5 text-blue-400" />
                  <span>Project Title: {booking.projectTitle}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-3">
                  {booking.projectDescription}
                </p>
                <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-800/80 pt-2">
                  <span>Applicant: <strong className="text-slate-300">{booking.studentName}</strong> ({booking.studentEmail})</span>
                  <span>ID: {booking.studentId}</span>
                </div>
              </div>

              {booking.aiConflictNotes && (
                <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/40 text-amber-200 text-xs mb-4 flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{booking.aiConflictNotes}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-slate-800">
                {showRejectInput[booking.id] ? (
                  <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <input
                      type="text"
                      placeholder="Reason for rejection..."
                      value={rejectReason[booking.id] || ''}
                      onChange={(e) => setRejectReason({ ...rejectReason, [booking.id]: e.target.value })}
                      className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500"
                    />
                    <button
                      onClick={() => handleAction(booking.id, 'reject')}
                      disabled={loadingId === booking.id}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white"
                    >
                      Confirm Reject
                    </button>
                    <button
                      onClick={() => setShowRejectInput({ ...showRejectInput, [booking.id]: false })}
                      className="px-2 py-1.5 text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => setShowRejectInput({ ...showRejectInput, [booking.id]: true })}
                      disabled={loadingId === booking.id}
                      className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-rose-950/60 hover:text-rose-300 text-slate-300 border border-slate-700 transition-colors"
                    >
                      <XCircle className="w-4 h-4 text-rose-400" />
                      <span>Reject</span>
                    </button>

                    <button
                      onClick={() => handleAction(booking.id, 'approve')}
                      disabled={loadingId === booking.id}
                      className="flex items-center space-x-1.5 px-5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4 text-white" />
                      <span>Approve Access</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
