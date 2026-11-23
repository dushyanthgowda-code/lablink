import { describe, it, expect } from 'vitest';
import { 
  evaluateContenderFairness, 
  resolveConflictIntelligently 
} from '../src/lib/conflictEngine';
import { SlotBooking } from '../src/types';

describe('AI Conflict Resolution & Fair Allocation Engine', () => {
  const capstoneBooking: SlotBooking = {
    id: 'bk-test-1',
    equipmentId: 'eq-sem-01',
    equipmentName: 'FEI Quanta 200 Scanning Electron Microscope (SEM)',
    department: 'Materials Science',
    studentId: 'STU-001',
    studentName: 'Aarav Sharma',
    studentEmail: 'aarav@campus.edu',
    date: '2026-11-25',
    startTime: '10:00',
    endTime: '13:00',
    durationHours: 3,
    projectTitle: 'Nanowire Synthesis for Solar Cells',
    projectDescription: 'Final paper SEM morphology verification.',
    projectDeadline: '2026-11-28', // 3 days away
    urgencyLevel: 'Critical Capstone',
    facultyGuide: 'Dr. Ramesh Kulkarni',
    status: 'pending_faculty',
    createdAt: '2026-11-22T09:30:00Z',
  };

  const assignmentBooking: SlotBooking = {
    id: 'bk-test-2',
    equipmentId: 'eq-sem-01',
    equipmentName: 'FEI Quanta 200 Scanning Electron Microscope (SEM)',
    department: 'Biotechnology',
    studentId: 'STU-002',
    studentName: 'Priya Iyer',
    studentEmail: 'priya@campus.edu',
    date: '2026-11-25',
    startTime: '11:00',
    endTime: '14:00',
    durationHours: 3,
    projectTitle: 'Chitosan Scaffolds Pore Diameter',
    projectDescription: 'Coursework assignment analysis.',
    projectDeadline: '2026-12-15', // 20 days away
    urgencyLevel: 'Normal',
    facultyGuide: 'Dr. Sunita Sen',
    status: 'pending_faculty',
    createdAt: '2026-11-22T14:15:00Z',
  };

  it('should calculate higher fairness score for imminent capstone deadlines', () => {
    const evalCapstone = evaluateContenderFairness(capstoneBooking, 2, '2026-11-23');
    const evalAssignment = evaluateContenderFairness(assignmentBooking, 8, '2026-11-23');

    // Capstone student with 3-day deadline and low prior usage should outscore 20-day assignment
    expect(evalCapstone.totalScore).toBeGreaterThan(evalAssignment.totalScore);
    expect(evalCapstone.urgencyScore).toBe(35); // Critical Capstone
    expect(evalAssignment.urgencyScore).toBe(10); // Normal
    expect(evalCapstone.fairnessScore).toBeGreaterThan(evalAssignment.fairnessScore);
  });

  it('should resolve scheduling conflicts and award slot to the highest fair score', () => {
    const plan = resolveConflictIntelligently(
      'eq-sem-01',
      [capstoneBooking, assignmentBooking],
      { 'STU-001': 2, 'STU-002': 8 },
      '2026-11-23'
    );

    expect(plan.winningBooking.id).toBe('bk-test-1');
    expect(plan.winningBooking.studentName).toBe('Aarav Sharma');
    expect(plan.resolutionJustification).toContain('Aarav Sharma');
    expect(plan.runnerUps.length).toBe(1);
    expect(plan.runnerUps[0].booking.studentName).toBe('Priya Iyer');
    expect(plan.runnerUps[0].recommendedAlternative.suggestedSlot).toBeDefined();
  });

  it('should provide non-disruptive alternative slot for the runner-up student', () => {
    const plan = resolveConflictIntelligently(
      'eq-sem-01',
      [capstoneBooking, assignmentBooking]
    );

    const alternative = plan.runnerUps[0].recommendedAlternative;
    expect(alternative.explanation).toBeDefined();
    expect(alternative.suggestedSlot.length).toBeGreaterThan(0);
  });
});
