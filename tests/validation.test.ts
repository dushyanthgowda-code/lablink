import { describe, it, expect } from 'vitest';
import { 
  CreateBookingSchema, 
  FacultyActionSchema, 
  ResolveConflictRequestSchema,
  AssistantMessageSchema
} from '../src/lib/validation';

describe('Zod Validation Schemas (Security & Input Sanitization)', () => {
  it('should validate a correct booking payload', () => {
    const validData = {
      equipmentId: 'eq-sem-01',
      date: '2026-11-25',
      startTime: '10:00',
      endTime: '13:00',
      studentId: 'STU-2024-1100',
      studentName: 'Rohan Deshmukh',
      studentEmail: 'rohan.d@campus.edu',
      department: 'CSE',
      projectTitle: 'Autonomous Navigation using Edge AI',
      projectDescription: 'Evaluation of tensor inference latency on edge device.',
      projectDeadline: '2026-11-30',
      urgencyLevel: 'High',
      facultyGuide: 'Dr. Ramesh Kulkarni',
    };

    const res = CreateBookingSchema.safeParse(validData);
    expect(res.success).toBe(true);
  });

  it('should reject invalid dates and invalid emails', () => {
    const invalidData = {
      equipmentId: 'eq-sem-01',
      date: 'invalid-date',
      startTime: '10:00',
      endTime: '13:00',
      studentId: 'STU',
      studentName: 'A',
      studentEmail: 'not-an-email',
      department: 'ECE',
      projectTitle: 'Too',
      projectDescription: 'Short',
      projectDeadline: '2026/11/30',
      urgencyLevel: 'High',
      facultyGuide: 'Dr',
    };

    const res = CreateBookingSchema.safeParse(invalidData);
    expect(res.success).toBe(false);
  });

  it('should validate faculty actions properly', () => {
    const validApprove = { bookingId: 'bk-101', action: 'approve' };
    const validReject = { bookingId: 'bk-102', action: 'reject', reason: 'Safety training missing' };
    const invalidAction = { bookingId: 'bk-103', action: 'delete' };

    expect(FacultyActionSchema.safeParse(validApprove).success).toBe(true);
    expect(FacultyActionSchema.safeParse(validReject).success).toBe(true);
    expect(FacultyActionSchema.safeParse(invalidAction).success).toBe(false);
  });

  it('should require at least 2 contenders for conflict resolution', () => {
    const oneContender = { equipmentId: 'eq-01', bookingIds: ['bk-1'] };
    const twoContenders = { equipmentId: 'eq-01', bookingIds: ['bk-1', 'bk-2'] };

    expect(ResolveConflictRequestSchema.safeParse(oneContender).success).toBe(false);
    expect(ResolveConflictRequestSchema.safeParse(twoContenders).success).toBe(true);
  });

  it('should validate assistant messages and reject empty payloads', () => {
    expect(AssistantMessageSchema.safeParse({ message: '' }).success).toBe(false);
    expect(AssistantMessageSchema.safeParse({ message: 'How do I book a slot?' }).success).toBe(true);
  });
});
