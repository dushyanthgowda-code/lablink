'use client';

import React, { useState } from 'react';
import { Equipment } from '../types';
import { 
  Building2, 
  Sparkles, 
  CalendarPlus, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  AlertTriangle, 
  Activity,
  Layers
} from 'lucide-react';

interface EquipmentCardProps {
  equipment: Equipment;
  relevanceScore?: number;
  matchReason?: string;
  onRequestBooking: (eq: Equipment) => void;
}

export const EquipmentCard: React.FC<EquipmentCardProps> = ({
  equipment,
  relevanceScore,
  matchReason,
  onRequestBooking,
}) => {
  const [showSpecs, setShowSpecs] = useState(false);

  const getDepartmentColor = (dept: string) => {
    switch (dept) {
      case 'CSE': return 'bg-cyan-950/60 text-cyan-300 border-cyan-800/60';
      case 'ECE': return 'bg-amber-950/60 text-amber-300 border-amber-800/60';
      case 'Mechanical': return 'bg-orange-950/60 text-orange-300 border-orange-800/60';
      case 'Biotechnology': return 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60';
      case 'Materials Science': return 'bg-purple-950/60 text-purple-300 border-purple-800/60';
      case 'Robotics': return 'bg-rose-950/60 text-rose-300 border-rose-800/60';
      default: return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const getSafetyBadge = (level: string) => {
    switch (level) {
      case 'Basic':
        return <span className="inline-flex items-center text-xs text-emerald-400"><CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Safety: Standard</span>;
      case 'Moderate':
        return <span className="inline-flex items-center text-xs text-amber-400"><AlertTriangle className="w-3.5 h-3.5 mr-1" /> Safety: Moderate Protocol</span>;
      case 'Hazardous / Controlled':
        return <span className="inline-flex items-center text-xs text-rose-400 font-semibold"><AlertTriangle className="w-3.5 h-3.5 mr-1" /> Safety: Controlled / Certification Required</span>;
      default:
        return null;
    }
  };

  return (
    <article 
      className="bg-slate-900/90 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all duration-200 overflow-hidden shadow-lg flex flex-col justify-between"
      aria-labelledby={`eq-title-${equipment.id}`}
    >
      <div className="p-5">
        {/* Header Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center space-x-2">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getDepartmentColor(equipment.department)}`}>
              {equipment.department}
            </span>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">
              {equipment.category.replace('_', ' ')}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
              equipment.status === 'available'
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                : equipment.status === 'busy'
                ? 'bg-amber-950/80 text-amber-300 border border-amber-800'
                : 'bg-rose-950/80 text-rose-300 border border-rose-800'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                equipment.status === 'available' ? 'bg-emerald-400' : equipment.status === 'busy' ? 'bg-amber-400' : 'bg-rose-400'
              }`} />
              {equipment.status.charAt(0).toUpperCase() + equipment.status.slice(1)}
            </span>
          </div>
        </div>

        {/* Title & Lab Location */}
        <h3 id={`eq-title-${equipment.id}`} className="text-lg font-bold text-white mb-1.5 leading-snug">
          {equipment.name}
        </h3>
        
        <div className="flex items-center text-xs text-slate-400 mb-3">
          <Building2 className="w-3.5 h-3.5 mr-1 text-slate-500 shrink-0" aria-hidden="true" />
          <span>{equipment.labName} • {equipment.building}</span>
        </div>

        {/* GenAI Semantic Match Banner (if scored) */}
        {relevanceScore !== undefined && matchReason && (
          <div className="mb-3 p-2.5 rounded-xl bg-blue-950/40 border border-blue-800/40 text-blue-200 text-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold flex items-center text-blue-300">
                <Sparkles className="w-3.5 h-3.5 mr-1 text-cyan-400" aria-hidden="true" />
                GenAI Match: {relevanceScore}%
              </span>
            </div>
            <p className="text-slate-300 line-clamp-2 leading-relaxed">{matchReason}</p>
          </div>
        )}

        {/* Description */}
        <p className="text-sm text-slate-300 mb-4 line-clamp-3 leading-relaxed">
          {equipment.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {equipment.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-400 text-xs">
              #{tag}
            </span>
          ))}
          {equipment.tags.length > 4 && (
            <span className="text-xs text-slate-500 self-center">+{equipment.tags.length - 4} more</span>
          )}
        </div>

        {/* Collapsible Specs & Prerequisites */}
        <div className="border-t border-slate-800 pt-3">
          <button
            onClick={() => setShowSpecs(!showSpecs)}
            className="flex items-center justify-between w-full text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
            aria-expanded={showSpecs}
          >
            <span className="flex items-center">
              <Layers className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
              Technical Specs & Prerequisites ({Object.keys(equipment.specifications).length})
            </span>
            {showSpecs ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showSpecs && (
            <div className="mt-3 space-y-3 text-xs bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <div>
                <p className="text-slate-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">Specifications:</p>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-1">
                  {Object.entries(equipment.specifications).map(([key, val]) => (
                    <div key={key} className="flex flex-col">
                      <dt className="text-slate-500 text-[11px]">{key}:</dt>
                      <dd className="text-slate-200 font-medium">{val}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div>
                <p className="text-slate-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">Required Clearances:</p>
                <ul className="list-disc list-inside text-slate-300 space-y-0.5">
                  {equipment.prerequisites.map((req, idx) => (
                    <li key={idx}>{req}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Details & Action Button */}
      <div className="p-4 bg-slate-950/40 border-t border-slate-800 flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <div className="flex items-center space-x-1.5 text-xs text-slate-400">
            <Activity className="w-3.5 h-3.5 text-blue-400" />
            <span>Utilization: <strong className="text-slate-200">{equipment.utilizationScore}%</strong></span>
          </div>
          <div className="mt-0.5">
            {getSafetyBadge(equipment.safetyLevel)}
          </div>
        </div>

        <button
          onClick={() => onRequestBooking(equipment)}
          disabled={equipment.status === 'maintenance'}
          className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold shadow-md transition-all ${
            equipment.status === 'maintenance'
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30 active:scale-95'
          }`}
          aria-label={`Request slot for ${equipment.name}`}
        >
          <CalendarPlus className="w-4 h-4" aria-hidden="true" />
          <span>Request Slot</span>
        </button>
      </div>
    </article>
  );
};
