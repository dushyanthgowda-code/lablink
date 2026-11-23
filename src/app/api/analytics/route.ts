import { NextResponse } from 'next/server';
import { labStore } from '@/lib/store';
import { INITIAL_EQUIPMENT } from '@/data/mockData';

export async function GET() {
  const utilization = labStore.getUtilization();
  const bookings = labStore.getBookings();
  const equipment = INITIAL_EQUIPMENT;

  // Aggregate high-level stats
  const totalEquipmentCount = equipment.length;
  const activeBookingsCount = bookings.filter(b => b.status === 'approved').length;
  const pendingApprovalsCount = bookings.filter(b => b.status === 'pending_faculty').length;
  const activeConflictsCount = bookings.filter(b => b.status === 'conflict_flagged').length;
  const averageCampusUtilization = Math.round(
    utilization.reduce((sum, item) => sum + item.utilizationRate, 0) / utilization.length
  );

  return NextResponse.json({
    success: true,
    data: {
      metrics: {
        totalEquipmentCount,
        activeBookingsCount,
        pendingApprovalsCount,
        activeConflictsCount,
        averageCampusUtilization
      },
      departmentBreakdown: utilization,
      topBottlenecks: [
        { name: 'NVIDIA DGX Station A100', department: 'CSE', utilization: 96, waitlistDays: 4 },
        { name: 'NVIDIA Jetson AGX Orin Dev Kit', department: 'CSE', utilization: 92, waitlistDays: 3 },
        { name: 'FEI Quanta 200 SEM', department: 'Materials Science', utilization: 88, waitlistDays: 5 },
        { name: 'Rigaku SmartLab XRD', department: 'Materials Science', utilization: 85, waitlistDays: 2 },
      ]
    }
  });
}
