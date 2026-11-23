import { Equipment, SlotBooking, ConflictCase } from '../types';
import { INITIAL_EQUIPMENT } from '../data/mockData';

export interface SemanticSearchResult {
  equipment: Equipment;
  relevanceScore: number;
  matchReason: string;
  recommendedPrepSteps: string[];
  suggestedDurationHours: number;
}

export function searchEquipmentSemantically(
  query: string,
  departmentFilter?: string,
  categoryFilter?: string
): SemanticSearchResult[] {
  const cleanQuery = query.toLowerCase().trim();
  
  return INITIAL_EQUIPMENT
    .filter(eq => {
      if (departmentFilter && departmentFilter !== 'All' && eq.department !== departmentFilter) return false;
      if (categoryFilter && categoryFilter !== 'All' && eq.category !== categoryFilter) return false;
      return true;
    })
    .map(eq => {
      let score = 0;
      const reasons: string[] = [];

      if (!cleanQuery) {
        return {
          equipment: eq,
          relevanceScore: 100,
          matchReason: 'Direct catalog listing matching current filter parameters.',
          recommendedPrepSteps: eq.prerequisites,
          suggestedDurationHours: 2
        };
      }

      // Keyword & synonym mappings
      const queryTokens = cleanQuery.split(/\s+/).filter(t => t.length > 2);
      
      // Name match
      if (eq.name.toLowerCase().includes(cleanQuery)) {
        score += 60;
        reasons.push(`Direct title match on "${eq.name}"`);
      }

      // Tags match
      eq.tags.forEach(tag => {
        if (cleanQuery.includes(tag.toLowerCase())) {
          score += 25;
          reasons.push(`Matched capability tag "${tag}"`);
        }
        queryTokens.forEach(token => {
          if (tag.toLowerCase().includes(token)) {
            score += 15;
          }
        });
      });

      // Semantic Intent Detections
      if ((cleanQuery.includes('microscop') || cleanQuery.includes('nano') || cleanQuery.includes('surface') || cleanQuery.includes('magnif')) && eq.id === 'eq-sem-01') {
        score += 50;
        reasons.push('High-resolution nanometer imaging capability matched for specimen observation.');
      }
      if ((cleanQuery.includes('rf') || cleanQuery.includes('antenna') || cleanQuery.includes('s11') || cleanQuery.includes('frequency') || cleanQuery.includes('microwave') || cleanQuery.includes('signal')) && eq.id === 'eq-vna-02') {
        score += 50;
        reasons.push('High-frequency microwave characterization matched for RF impedance/antenna testing.');
      }
      if ((cleanQuery.includes('jetson') || cleanQuery.includes('edge') || cleanQuery.includes('robot') || cleanQuery.includes('embedded') || cleanQuery.includes('autonomous')) && eq.id === 'eq-jetson-03') {
        score += 50;
        reasons.push('Edge AI accelerator matched for low-latency robotics or embedded deep learning.');
      }
      if ((cleanQuery.includes('gpu') || cleanQuery.includes('llm') || cleanQuery.includes('train') || cleanQuery.includes('large language') || cleanQuery.includes('deep learning') || cleanQuery.includes('cuda')) && eq.id === 'eq-gpu-04') {
        score += 55;
        reasons.push('Dedicated 320GB SXM4 tensor compute matched for high-parameter deep learning models.');
      }
      if ((cleanQuery.includes('tensile') || cleanQuery.includes('stress') || cleanQuery.includes('strain') || cleanQuery.includes('break') || cleanQuery.includes('load') || cleanQuery.includes('compression')) && eq.id === 'eq-utm-06') {
        score += 50;
        reasons.push('Mechanical load cell matched for tensile, yield, and flexural stress-strain analysis.');
      }
      if ((cleanQuery.includes('3d print') || cleanQuery.includes('sla') || cleanQuery.includes('resin') || cleanQuery.includes('biomedical') || cleanQuery.includes('microfluidic')) && eq.id === 'eq-sla-07') {
        score += 50;
        reasons.push('High-precision stereolithography matched for biocompatible prototyping and microdevices.');
      }
      if ((cleanQuery.includes('wind') || cleanQuery.includes('airfoil') || cleanQuery.includes('aerodynamic') || cleanQuery.includes('drag') || cleanQuery.includes('lift') || cleanQuery.includes('uav')) && eq.id === 'eq-wind-08') {
        score += 50;
        reasons.push('Open-jet subsonic flow facility matched for aerodynamic lift/drag coefficient calibration.');
      }
      if ((cleanQuery.includes('xrd') || cleanQuery.includes('diffraction') || cleanQuery.includes('crystal') || cleanQuery.includes('phase')) && eq.id === 'eq-xrd-09') {
        score += 50;
        reasons.push('Powder X-ray diffractometer matched for crystal lattice and phase identification.');
      }
      if ((cleanQuery.includes('fpga') || cleanQuery.includes('verilog') || cleanQuery.includes('xilinx') || cleanQuery.includes('hardware accelerator') || cleanQuery.includes('mpsoc')) && eq.id === 'eq-fpga-10') {
        score += 50;
        reasons.push('Heterogeneous FPGA fabric matched for hardware acceleration and RTL verification.');
      }
      if ((cleanQuery.includes('arm') || cleanQuery.includes('manipulat') || cleanQuery.includes('kinematics') || cleanQuery.includes('pick and place')) && eq.id === 'eq-kuka-05') {
        score += 50;
        reasons.push('6-Axis industrial robotics manipulator matched for trajectory planning and automation.');
      }

      // Specifications match
      Object.entries(eq.specifications).forEach(([specKey, specVal]) => {
        if (cleanQuery.includes(specKey.toLowerCase()) || cleanQuery.includes(specVal.toLowerCase())) {
          score += 15;
          reasons.push(`Equipment spec matches: ${specKey} (${specVal})`);
        }
      });

      // Clamp score
      const finalScore = Math.min(100, Math.max(10, score));
      const reasonSummary = reasons.length > 0 
        ? reasons.slice(0, 2).join(' • ') 
        : `Matches department (${eq.department}) laboratory profile.`;

      return {
        equipment: eq,
        relevanceScore: finalScore,
        matchReason: reasonSummary,
        recommendedPrepSteps: eq.prerequisites,
        suggestedDurationHours: eq.category === 'workstation' ? 4 : 2
      };
    })
    .filter(res => !cleanQuery || res.relevanceScore >= 20)
    .sort((a, b) => b.relevanceScore - a.relevanceScore);
}
