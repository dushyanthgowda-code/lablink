import { describe, it, expect } from 'vitest';
import { labStore } from '../src/lib/store';

describe('LabStore State Management & Conflict Detection', () => {
  it('should initialize with mock campus equipment and bookings', () => {
    const equipment = labStore.getEquipment();
    expect(equipment.length).toBeGreaterThanOrEqual(10);

    const bookings = labStore.getBookings();
    expect(bookings.length).toBeGreaterThanOrEqual(4);
  });

  it('should detect time slot conflicts on overlapping bookings', () => {
    const result = labStore.addBooking({
      equipmentId: 'eq-sem-01',
      equipmentName: 'FEI Quanta 200 Scanning Electron Microscope (SEM)',
      department: 'Materials Science',
      studentId: 'STU-999',
      studentName: 'Conflict Test Student',
      studentEmail: 'conflict@campus.edu',
      date: '2026-11-25',
      startTime: '10:30', // overlaps with bk-101 (10:00 - 13:00)
      endTime: '12:30',
      projectTitle: 'Overlap Test Project',
      projectDescription: 'Testing conflict engine detection sensitivity.',
      projectDeadline: '2026-11-29',
      urgencyLevel: 'Normal',
      facultyGuide: 'Dr. Ramesh Kulkarni',
    });

    expect(result.hasConflict).toBe(true);
    expect(result.booking.status).toBe('conflict_flagged');
    expect(result.conflictCase).toBeDefined();
    expect(result.conflictCase?.contenders.length).toBeGreaterThanOrEqual(2);
  });

  it('should allow faculty to approve or reject bookings', () => {
    const updated = labStore.updateBookingStatus('bk-103', 'approved');
    expect(updated).not.toBeNull();
    expect(updated?.status).toBe('approved');

    const rejected = labStore.updateBookingStatus('bk-104', 'rejected', 'Missing prerequisite clearance');
    expect(rejected).not.toBeNull();
    expect(rejected?.status).toBe('rejected');
    expect(rejected?.rejectionReason).toBe('Missing prerequisite clearance');
  });
});
