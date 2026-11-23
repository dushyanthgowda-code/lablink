'use client';

import React from 'react';
import { SlotBooking } from '../types';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Hourglass,
  FileText,
  Building,
  GraduationCap
} from 'lucide-react';

interface StudentBookingsViewProps {
  bookings: SlotBooking[];
  onOpenBookingModal: () => void;
}

export const StudentBookingsView: React.FC<StudentBookingsViewProps> = ({
  bookings,
  onOpenBookingModal,
}) => {
  const getStatusBadge = (status: SlotBooking['status']) => {
    switch (status) {
      case 'approved':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800 flex items-center">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Approved
          </span>
        );
      case 'conflict_flagged':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-950/80 text-amber-300 border border-amber-800 flex items-center">
            <AlertTriangle className="w-3.5 h-3.5 mr-1" /> AI Conflict Pending
          </span>
        );
      case 'rejected':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-950/80 text-rose-300 border border-rose-800 flex items-center">
            <XCircle className="w-3.5 h-3.5 mr-1" /> Rejected
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-950/80 text-blue-300 border border-blue-800 flex items-center">
            <Hourglass className="w-3.5 h-3.5 mr-1" /> Pending Guide Review
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900/40 via-slate-900 to-slate-900 border border-blue-800/40 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">
            My Laboratory Reservations & Projects
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Track real-time approval status, conflict mitigations, and schedule slots for your capstone and thesis milestones.
          </p>
        </div>
        <button
          onClick={onOpenBookingModal}
          className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition-all shrink-0"
        >
          + New Equipment Request
        </button>
      </div>

      {/* Bookings Feed */}
      {bookings.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/60 rounded-3xl border border-slate-800 p-8">
          <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">No Reservations Found</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mb-4">
            You have not booked any campus laboratory instruments yet. Discover equipment to start a project reservation.
          </p>
          <button
            onClick={onOpenBookingModal}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white"
          >
            Browse Equipment Catalog
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bookings.map((b) => (
            <div 
              key={b.id}
              className="bg-slate-900 rounded-3xl border border-slate-800 p-5 shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md">
                    {b.id}
                  </span>
                  {getStatusBadge(b.status)}
                </div>

                <h3 className="text-base font-bold text-white mb-1 leading-snug">
                  {b.equipmentName}
                </h3>

                <p className="text-xs text-slate-400 flex items-center mb-3">
                  <Building className="w-3.5 h-3.5 mr-1 text-slate-500" />
                  {b.department} Department
                </p>

                <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 mb-3 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-1 text-blue-400" /> Date:
                    </span>
                    <strong className="text-slate-200">{b.date}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center">
                      <Clock className="w-3.5 h-3.5 mr-1 text-blue-400" /> Time Window:
                    </span>
                    <strong className="text-slate-200">{b.startTime} - {b.endTime} ({b.durationHours}h)</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Project Deadline:</span>
                    <strong className="text-amber-400">{b.projectDeadline}</strong>
                  </div>
                </div>

                <div className="text-xs text-slate-400 mb-2">
                  <span className="font-semibold text-slate-300 block mb-0.5 flex items-center">
                    <FileText className="w-3 h-3 mr-1 text-slate-400" /> Project: {b.projectTitle}
                  </span>
                  <p className="line-clamp-2 text-slate-400">{b.projectDescription}</p>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-3 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center">
                  <GraduationCap className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  {b.facultyGuide}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[11px] font-medium">
                  {b.urgencyLevel}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
