'use client';

import React, { useState, useEffect } from 'react';
import { Equipment } from '../types';
import { 
  X, 
  Calendar, 
  Clock, 
  Send, 
  AlertCircle, 
  FileText, 
  User, 
  GraduationCap, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface BookingModalProps {
  equipment: Equipment | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  equipment,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    date: '2026-11-25',
    startTime: '10:00',
    endTime: '13:00',
    studentId: 'STU-2024-5590',
    studentName: 'Sneha Patel',
    studentEmail: 'sneha.patel@campus.edu',
    department: 'CSE' as Equipment['department'],
    projectTitle: '',
    projectDescription: '',
    projectDeadline: '2026-11-29',
    urgencyLevel: 'High' as 'Normal' | 'High' | 'Critical Capstone',
    facultyGuide: 'Dr. Ramesh Kulkarni',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (equipment) {
      setFormData(prev => ({
        ...prev,
        department: equipment.department,
      }));
    }
  }, [equipment]);

  // Keyboard accessibility: ESC key closes modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !equipment) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          equipmentId: equipment.id,
        }),
      });

      const res = await response.json();
      if (!response.ok) {
        throw new Error(res.error || 'Failed to submit booking');
      }

      onSuccess(res.message);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Submission failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
    >
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-950/50">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-blue-400 mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Project-Based Lab Reservation</span>
            </div>
            <h2 id="booking-modal-title" className="text-xl font-bold text-white">
              Request Slot: {equipment.name}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {equipment.labName} • {equipment.building}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            aria-label="Close booking modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-200 text-xs flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Slot Schedule Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-950/50 border border-slate-800">
            <div>
              <label htmlFor="slot-date" className="block text-xs font-medium text-slate-300 mb-1 flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1 text-blue-400" />
                Date
              </label>
              <input
                id="slot-date"
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="slot-start" className="block text-xs font-medium text-slate-300 mb-1 flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1 text-blue-400" />
                Start Time
              </label>
              <input
                id="slot-start"
                type="time"
                required
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="slot-end" className="block text-xs font-medium text-slate-300 mb-1 flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1 text-blue-400" />
                End Time
              </label>
              <input
                id="slot-end"
                type="time"
                required
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Student & Project Details */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="project-title" className="block text-xs font-medium text-slate-300 mb-1 flex items-center">
                  <FileText className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  Academic Project Title
                </label>
                <input
                  id="project-title"
                  type="text"
                  required
                  placeholder="e.g. Quadcopter Telemetry RF Link"
                  value={formData.projectTitle}
                  onChange={(e) => setFormData({ ...formData, projectTitle: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="project-deadline" className="block text-xs font-medium text-slate-300 mb-1 flex items-center">
                  <Calendar className="w-3.5 h-3.5 mr-1 text-amber-400" />
                  Submission / Milestone Deadline
                </label>
                <input
                  id="project-deadline"
                  type="date"
                  required
                  value={formData.projectDeadline}
                  onChange={(e) => setFormData({ ...formData, projectDeadline: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="project-desc" className="block text-xs font-medium text-slate-300 mb-1">
                Project Scope & Equipment Justification
              </label>
              <textarea
                id="project-desc"
                rows={3}
                required
                placeholder="Explain the experimental procedure, required parameters, and why this specific instrument is necessary..."
                value={formData.projectDescription}
                onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="urgency-tier" className="block text-xs font-medium text-slate-300 mb-1">
                  Urgency / Academic Tier
                </label>
                <select
                  id="urgency-tier"
                  value={formData.urgencyLevel}
                  onChange={(e) => setFormData({ ...formData, urgencyLevel: e.target.value as any })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Normal">Normal (Coursework)</option>
                  <option value="High">High (M.Tech / Major Project)</option>
                  <option value="Critical Capstone">Critical Capstone (Final Thesis)</option>
                </select>
              </div>

              <div>
                <label htmlFor="faculty-guide" className="block text-xs font-medium text-slate-300 mb-1 flex items-center">
                  <GraduationCap className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  Faculty Guide
                </label>
                <input
                  id="faculty-guide"
                  type="text"
                  required
                  value={formData.facultyGuide}
                  onChange={(e) => setFormData({ ...formData, facultyGuide: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="student-name" className="block text-xs font-medium text-slate-300 mb-1 flex items-center">
                  <User className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  Applicant Name
                </label>
                <input
                  id="student-name"
                  type="text"
                  required
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* AI Pre-Validation Notice */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mr-1.5" />
              Automated conflict checks & faculty routing enabled
            </span>
            <span className="text-slate-500">Max slot length: 4h</span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition-all disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{loading ? 'Validating...' : 'Submit Slot Request'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
