import { z } from 'zod';

export const EquipmentSearchSchema = z.object({
  query: z.string().max(200).optional().default(''),
  department: z.string().max(50).optional().default('All'),
  category: z.string().max(50).optional().default('All'),
});

export const CreateBookingSchema = z.object({
  equipmentId: z.string().min(1, 'Equipment ID is required'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Start time must be HH:MM format'),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, 'End time must be HH:MM format'),
  studentId: z.string().min(3, 'Student ID required'),
  studentName: z.string().min(2, 'Student Name required'),
  studentEmail: z.string().email('Valid campus email required'),
  department: z.enum(['ECE', 'CSE', 'Mechanical', 'Biotechnology', 'Robotics', 'Materials Science']),
  projectTitle: z.string().min(5, 'Project title must be at least 5 characters'),
  projectDescription: z.string().min(10, 'Project description must be at least 10 characters'),
  projectDeadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Deadline must be in YYYY-MM-DD format'),
  urgencyLevel: z.enum(['Normal', 'High', 'Critical Capstone']),
  facultyGuide: z.string().min(3, 'Faculty guide name is required'),
});

export const FacultyActionSchema = z.object({
  bookingId: z.string().min(1, 'Booking ID is required'),
  action: z.enum(['approve', 'reject']),
  reason: z.string().max(300).optional(),
});

export const ResolveConflictRequestSchema = z.object({
  equipmentId: z.string().min(1),
  bookingIds: z.array(z.string()).min(2, 'At least 2 conflicting bookings required'),
});

export const AssistantMessageSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty').max(1000),
  contextEquipmentId: z.string().optional(),
});
