import { Equipment, SlotBooking, ConflictCase, DepartmentUtilization } from '../types';
import { 
  INITIAL_EQUIPMENT, 
  INITIAL_BOOKINGS, 
  INITIAL_CONFLICTS, 
  DEPARTMENT_UTILIZATION_DATA 
} from '../data/mockData';

// In-memory data store with state manipulation methods
class LabStore {
  private equipment: Equipment[] = [...INITIAL_EQUIPMENT];
  private bookings: SlotBooking[] = [...INITIAL_BOOKINGS];
  private conflicts: ConflictCase[] = [...INITIAL_CONFLICTS];
  private utilization: DepartmentUtilization[] = [...DEPARTMENT_UTILIZATION_DATA];

  public getEquipment(query?: string, department?: string, category?: string): Equipment[] {
    return this.equipment.filter(eq => {
      if (department && department !== 'All' && eq.department !== department) return false;
      if (category && category !== 'All' && eq.category !== category) return false;
      if (query && query.trim()) {
        const q = query.toLowerCase();
        return (
          eq.name.toLowerCase().includes(q) ||
          eq.description.toLowerCase().includes(q) ||
          eq.tags.some(t => t.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }

  public getEquipmentById(id: string): Equipment | undefined {
    return this.equipment.find(e => e.id === id);
  }

  public getBookings(): SlotBooking[] {
    return this.bookings;
  }

  public getBookingById(id: string): SlotBooking | undefined {
    return this.bookings.find(b => b.id === id);
  }

  public addBooking(bookingData: Omit<SlotBooking, 'id' | 'createdAt' | 'status' | 'durationHours'>): { 
    booking: SlotBooking; 
    hasConflict: boolean;
    conflictCase?: ConflictCase;
  } {
    const startHour = parseInt(bookingData.startTime.split(':')[0], 10);
    const endHour = parseInt(bookingData.endTime.split(':')[0], 10);
    const durationHours = Math.max(1, endHour - startHour);

    const newBooking: SlotBooking = {
      ...bookingData,
      id: `bk-${Date.now().toString().slice(-4)}`,
      status: 'pending_faculty',
      durationHours,
      createdAt: new Date().toISOString(),
    };

    // Check for overlap on same equipment and date
    const overlaps = this.bookings.filter(b => 
      b.equipmentId === bookingData.equipmentId &&
      b.date === bookingData.date &&
      b.status !== 'rejected' &&
      !(bookingData.endTime <= b.startTime || bookingData.startTime >= b.endTime)
    );

    let hasConflict = false;
    let conflictCase: ConflictCase | undefined;

    if (overlaps.length > 0) {
      hasConflict = true;
      newBooking.status = 'conflict_flagged';
      newBooking.aiConflictNotes = `Scheduling conflict detected with booking ${overlaps[0].id} (${overlaps[0].studentName})`;
      
      conflictCase = {
        id: `conf-${Date.now().toString().slice(-4)}`,
        equipmentId: bookingData.equipmentId,
        equipmentName: bookingData.equipmentName,
        date: bookingData.date,
        timeSlot: `${bookingData.startTime} - ${bookingData.endTime}`,
        contenders: [
          ...overlaps.map(o => ({
            bookingId: o.id,
            studentName: o.studentName,
            studentEmail: o.studentEmail,
            department: o.department,
            projectTitle: o.projectTitle,
            projectDeadline: o.projectDeadline,
            urgency: o.urgencyLevel,
            priorHoursThisWeek: 4,
            submissionTime: o.createdAt
          })),
          {
            bookingId: newBooking.id,
            studentName: newBooking.studentName,
            studentEmail: newBooking.studentEmail,
            department: newBooking.department,
            projectTitle: newBooking.projectTitle,
            projectDeadline: newBooking.projectDeadline,
            urgency: newBooking.urgencyLevel,
            priorHoursThisWeek: 2,
            submissionTime: newBooking.createdAt
          }
        ]
      };

      this.conflicts.unshift(conflictCase);
    }

    this.bookings.unshift(newBooking);
    return { booking: newBooking, hasConflict, conflictCase };
  }

  public updateBookingStatus(id: string, status: SlotBooking['status'], reason?: string): SlotBooking | null {
    const booking = this.bookings.find(b => b.id === id);
    if (!booking) return null;
    booking.status = status;
    if (reason) booking.rejectionReason = reason;
    return booking;
  }

  public getConflicts(): ConflictCase[] {
    return this.conflicts;
  }

  public getUtilization(): DepartmentUtilization[] {
    return this.utilization;
  }
}

// Global singleton
export const labStore = new LabStore();
