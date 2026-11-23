export type ResourceCategory = 'specialised_equipment' | 'development_kit' | 'workstation';

export type Department = 
  | 'ECE' 
  | 'CSE' 
  | 'Mechanical' 
  | 'Biotechnology' 
  | 'Robotics' 
  | 'Materials Science';

export type SafetyLevel = 'Basic' | 'Moderate' | 'Hazardous / Controlled';

export interface Equipment {
  id: string;
  name: string;
  category: ResourceCategory;
  department: Department;
  labName: string;
  building: string;
  description: string;
  specifications: Record<string, string>;
  safetyLevel: SafetyLevel;
  prerequisites: string[];
  status: 'available' | 'maintenance' | 'busy';
  hourlyCostTokens: number;
  tags: string[];
  utilizationScore: number; // 0 - 100 percentage
  totalBookings: number;
  imageUrl?: string;
}

export type BookingUrgency = 'Normal' | 'High' | 'Critical Capstone';

export type BookingStatus = 
  | 'pending_faculty' 
  | 'approved' 
  | 'rejected' 
  | 'conflict_flagged' 
  | 'completed';

export interface SlotBooking {
  id: string;
  equipmentId: string;
  equipmentName: string;
  department: Department;
  studentId: string;
  studentName: string;
  studentEmail: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM (e.g. 09:00)
  endTime: string; // HH:MM (e.g. 12:00)
  durationHours: number;
  projectTitle: string;
  projectDescription: string;
  projectDeadline: string; // YYYY-MM-DD
  urgencyLevel: BookingUrgency;
  facultyGuide: string;
  status: BookingStatus;
  rejectionReason?: string;
  aiFairnessScore?: number;
  aiConflictNotes?: string;
  createdAt: string;
}

export interface ConflictCase {
  id: string;
  equipmentId: string;
  equipmentName: string;
  date: string;
  timeSlot: string;
  contenders: {
    bookingId: string;
    studentName: string;
    studentEmail: string;
    department: Department;
    projectTitle: string;
    projectDeadline: string;
    urgency: BookingUrgency;
    priorHoursThisWeek: number;
    submissionTime: string;
  }[];
  aiRecommendation?: {
    preferredBookingId: string;
    preferredStudentName: string;
    fairnessScore: number;
    reasoning: string;
    suggestedAlternative: {
      bookingId: string;
      studentName: string;
      alternativeEquipmentId?: string;
      alternativeEquipmentName?: string;
      alternativeSlot?: string;
      compromiseReason: string;
    };
  };
}

export interface DepartmentUtilization {
  department: Department;
  totalEquipment: number;
  activeBookings: number;
  utilizationRate: number; // percentage
  peakHours: string;
  bottleneckResources: string[];
}
