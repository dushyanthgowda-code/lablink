import { NextRequest, NextResponse } from 'next/server';
import { FacultyActionSchema } from '@/lib/validation';
import { labStore } from '@/lib/store';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = FacultyActionSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json({ error: 'Invalid faculty action', details: validated.error.format() }, { status: 400 });
    }

    const { bookingId, action, reason } = validated.data;
    const newStatus = action === 'approve' ? 'approved' : 'rejected';
    const updated = labStore.updateBookingStatus(bookingId, newStatus, reason);

    if (!updated) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: updated,
      message: `Booking ${bookingId} has been ${action}d by faculty.`
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal error';
    return NextResponse.json({ error: 'Faculty action failed', message }, { status: 500 });
  }
}
