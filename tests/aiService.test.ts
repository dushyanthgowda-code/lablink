import { describe, it, expect } from 'vitest';
import { searchEquipmentSemantically } from '../src/lib/aiService';

describe('GenAI Equipment Semantic Search', () => {
  it('should find Scanning Electron Microscope for nanoscale imaging queries', () => {
    const results = searchEquipmentSemantically('high resolution microscope for nanomaterials');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].equipment.name).toContain('Scanning Electron Microscope');
    expect(results[0].relevanceScore).toBeGreaterThanOrEqual(50);
  });

  it('should find Vector Network Analyzer for antenna RF queries', () => {
    const results = searchEquipmentSemantically('test s11 return loss on 5ghz antenna');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].equipment.name).toContain('Vector Network Analyzer');
    expect(results[0].equipment.department).toBe('ECE');
  });

  it('should find DGX Station or Jetson for deep learning workloads', () => {
    const results = searchEquipmentSemantically('need GPU cluster for LLM training');
    expect(results.length).toBeGreaterThan(0);
    const topResult = results[0];
    expect(topResult.equipment.department).toBe('CSE');
    expect(topResult.equipment.tags).toContain('gpu compute');
  });

  it('should find Universal Testing Machine for mechanical tensile tests', () => {
    const results = searchEquipmentSemantically('tensile stress strain yield strength');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].equipment.name).toContain('Universal Testing Machine');
  });

  it('should filter correctly by department', () => {
    const eceResults = searchEquipmentSemantically('', 'ECE', 'All');
    expect(eceResults.every(r => r.equipment.department === 'ECE')).toBe(true);
  });
});
