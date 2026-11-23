'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { Equipment, SlotBooking, ConflictCase } from '@/types';
import { Navbar } from '@/components/Navbar';
import { EquipmentCard } from '@/components/EquipmentCard';
import { BookingModal } from '@/components/BookingModal';
import { ConflictResolutionView } from '@/components/ConflictResolutionView';
import { FacultyApprovalPortal } from '@/components/FacultyApprovalPortal';
import { UtilizationAnalytics } from '@/components/UtilizationAnalytics';
import { LabCopilotChat } from '@/components/LabCopilotChat';
import { StudentBookingsView } from '@/components/StudentBookingsView';
import { 
  Search, 
  Sparkles, 
  Filter, 
  RotateCcw, 
  CheckCircle2, 
  ChevronRight,
  Shield,
  Layers,
  GraduationCap
} from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('discover');
  const [userRole, setUserRole] = useState<'student' | 'faculty'>('student');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedCat, setSelectedCat] = useState('All');
  
  const [equipmentList, setEquipmentList] = useState<{
    equipment: Equipment;
    relevanceScore?: number;
    matchReason?: string;
  }[]>([]);
  
  const [bookings, setBookings] = useState<SlotBooking[]>([]);
  const [conflicts, setConflicts] = useState<ConflictCase[]>([]);
  const [isPending, startTransition] = useTransition();

  const [selectedEquipmentForBooking, setSelectedEquipmentForBooking] = useState<Equipment | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const departments = ['All', 'CSE', 'ECE', 'Mechanical', 'Biotechnology', 'Robotics', 'Materials Science'];
  const categories = [
    { label: 'All Equipment', value: 'All' },
    { label: 'Specialised Gear', value: 'specialised_equipment' },
    { label: 'Development Kits', value: 'development_kit' },
    { label: 'Workstations', value: 'workstation' },
  ];

  const fetchEquipment = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('query', searchQuery);
    if (selectedDept !== 'All') params.set('department', selectedDept);
    if (selectedCat !== 'All') params.set('category', selectedCat);

    fetch(`/api/equipment?${params.toString()}`)
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setEquipmentList(json.data);
        }
      })
      .catch(console.error);
  };

  const fetchBookings = () => {
    fetch('/api/bookings')
      .then(res => res.json())
      .then(json => {
        if (json.success) setBookings(json.data);
      })
      .catch(console.error);
  };

  const fetchConflicts = () => {
    fetch('/api/conflicts')
      .then(res => res.json())
      .then(json => {
        if (json.success) setConflicts(json.data);
      })
      .catch(console.error);
  };

  useEffect(() => {
    startTransition(() => {
      fetchEquipment();
    });
  }, [searchQuery, selectedDept, selectedCat]);

  useEffect(() => {
    fetchBookings();
    fetchConflicts();
  }, []);

  const handleBookingSuccess = (msg: string) => {
    setNotification(msg);
    fetchBookings();
    fetchConflicts();
    setTimeout(() => setNotification(null), 6000);
  };

  const handleOpenBooking = (eq: Equipment) => {
    setSelectedEquipmentForBooking(eq);
    setIsBookingModalOpen(true);
  };

  const pendingApprovalsCount = bookings.filter(b => b.status === 'pending_faculty').length;
  const activeConflictsCount = conflicts.length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={userRole}
        setUserRole={setUserRole}
        pendingApprovalsCount={pendingApprovalsCount}
        activeConflictsCount={activeConflictsCount}
      />

      {/* Toast Notification */}
      {notification && (
        <div 
          role="status"
          aria-live="polite"
          className="fixed top-20 right-4 z-50 max-w-md bg-slate-900 border border-blue-500/50 shadow-2xl rounded-2xl p-4 text-xs text-blue-200 flex items-start space-x-3 backdrop-blur-md animate-in slide-in-from-top-2"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold text-white block mb-0.5">Campus Notification</span>
            <p className="text-slate-300">{notification}</p>
          </div>
          <button 
            onClick={() => setNotification(null)}
            className="text-slate-400 hover:text-white text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab 1: Equipment Discovery */}
        {activeTab === 'discover' && (
          <div className="space-y-8">
            {/* Hero Section */}
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-950/60 via-indigo-950/40 to-slate-900 border border-slate-800 p-8 sm:p-12 shadow-2xl">
              <div className="relative z-10 max-w-3xl space-y-4">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-cyan-300">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>GenAI Campus Laboratory Sharing Network</span>
                </div>
                <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                  Discover Specialized Labs & Hardware Across Departments
                </h1>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  Break down institutional silos. Access electron microscopes, RF analyzers, GPU superclusters, and robotic cells with intelligent scheduling and fair conflict resolution.
                </p>

                {/* GenAI Smart Search Bar */}
                <div className="pt-2">
                  <div className="relative flex items-center">
                    <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" aria-hidden="true" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Try: 'Need equipment to test aerodynamic drag on drone wings' or 'RF antenna return loss'..."
                      className="w-full pl-12 pr-28 py-4 bg-slate-900/90 border border-slate-700 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xl"
                      aria-label="Search laboratory equipment semantically"
                    />
                    {searchQuery ? (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-4 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white"
                      >
                        Clear
                      </button>
                    ) : (
                      <span className="absolute right-4 hidden sm:flex items-center space-x-1 text-[11px] text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-2.5 py-1 rounded-xl font-medium">
                        <Sparkles className="w-3 h-3" /> GenAI Search
                      </span>
                    )}
                  </div>

                  {/* Semantic Quick Filters */}
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <span className="text-slate-400 text-xs self-center">Popular:</span>
                    <button
                      onClick={() => setSearchQuery('Train vision LLM with GPU VRAM')}
                      className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700/60"
                    >
                      🤖 AI & LLM Training
                    </button>
                    <button
                      onClick={() => setSearchQuery('Antenna impedance S-parameters')}
                      className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700/60"
                    >
                      📡 20GHz Microwave RF
                    </button>
                    <button
                      onClick={() => setSearchQuery('Nanomaterial surface imaging')}
                      className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700/60"
                    >
                      🔬 Electron Microscopy
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Department & Category Tabs */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {/* Department Filters */}
                <div className="flex overflow-x-auto pb-2 sm:pb-0 space-x-1.5 max-w-full">
                  {departments.map((dept) => (
                    <button
                      key={dept}
                      onClick={() => setSelectedDept(dept)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                        selectedDept === dept
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                          : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800 hover:bg-slate-850'
                      }`}
                    >
                      {dept} {dept !== 'All' ? 'Dept' : ''}
                    </button>
                  ))}
                </div>

                {/* Category Selector */}
                <div className="flex items-center space-x-2">
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  <select
                    value={selectedCat}
                    onChange={(e) => setSelectedCat(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:ring-2 focus:ring-blue-500"
                    aria-label="Filter by resource category"
                  >
                    {categories.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Equipment Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {equipmentList.map((item) => (
                  <EquipmentCard
                    key={item.equipment.id}
                    equipment={item.equipment}
                    relevanceScore={item.relevanceScore}
                    matchReason={item.matchReason}
                    onRequestBooking={handleOpenBooking}
                  />
                ))}
              </div>

              {equipmentList.length === 0 && (
                <div className="text-center py-16 bg-slate-900/60 rounded-3xl border border-slate-800 p-8">
                  <p className="text-sm text-slate-300 mb-2">No instruments found matching your search parameters.</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedDept('All');
                      setSelectedCat('All');
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: My Bookings */}
        {activeTab === 'bookings' && (
          <StudentBookingsView
            bookings={bookings}
            onOpenBookingModal={() => {
              if (equipmentList.length > 0) {
                setSelectedEquipmentForBooking(equipmentList[0].equipment);
                setIsBookingModalOpen(true);
              }
            }}
          />
        )}

        {/* Tab 3: AI Conflict Resolution Hub */}
        {activeTab === 'conflicts' && (
          <ConflictResolutionView
            conflicts={conflicts}
            onRefresh={fetchConflicts}
          />
        )}

        {/* Tab 4: Faculty Approvals */}
        {activeTab === 'faculty' && (
          <FacultyApprovalPortal
            bookings={bookings}
            onActionComplete={() => {
              fetchBookings();
              fetchConflicts();
            }}
          />
        )}

        {/* Tab 5: Campus Analytics */}
        {activeTab === 'analytics' && <UtilizationAnalytics />}

        {/* Tab 6: LabLink Copilot */}
        {activeTab === 'copilot' && <LabCopilotChat />}
      </main>

      {/* Booking Modal */}
      <BookingModal
        equipment={selectedEquipmentForBooking}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onSuccess={handleBookingSuccess}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-400">LabLink</span>
            <span>• Built for PromptWars Hackathon (Cynergy Coding Club)</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <Shield className="w-3.5 h-3.5 mr-1 text-emerald-400" /> Secure Input Validation
            </span>
            <span className="flex items-center">
              <Sparkles className="w-3.5 h-3.5 mr-1 text-cyan-400" /> GenAI Resource Optimization
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
