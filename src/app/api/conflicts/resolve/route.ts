import { NextRequest, NextResponse } from 'next/server';
import { ResolveConflictRequestSchema } from '@/lib/validation';
import { labStore } from '@/lib/store';
import { resolveConflictIntelligently } from '@/lib/conflictEngine';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = ResolveConflictRequestSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json({ error: 'Validation failed', details: validated.error.format() }, { status: 400 });
    }

    const { equipmentId, bookingIds } = validated.data;
    const allBookings = labStore.getBookings();
    const contenders = allBookings.filter(b => bookingIds.includes(b.id));

    if (contenders.length < 2) {
      return NextResponse.json({ 
        error: 'Insufficient contenders found in registry',
        requestedIds: bookingIds 
      }, { status: 404 });
    }

    const resolutionPlan = resolveConflictIntelligently(equipmentId, contenders);

    // Apply resolution decisions to bookings
    labStore.updateBookingStatus(resolutionPlan.winningBooking.id, 'approved');
    resolutionPlan.runnerUps.forEach(r => {
      labStore.updateBookingStatus(
        r.booking.id, 
        'pending_faculty', 
        `Rescheduled recommendation: ${r.recommendedAlternative.suggestedSlot}`
      );
    });

    return NextResponse.json({
      success: true,
      message: 'AI Fair Allocation executed successfully.',
      data: resolutionPlan
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal error';
    return NextResponse.json({ error: 'Conflict resolution failed', message }, { status: 500 });
  }
}
