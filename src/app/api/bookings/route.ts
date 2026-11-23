import { NextRequest, NextResponse } from 'next/server';
import { CreateBookingSchema } from '@/lib/validation';
import { labStore } from '@/lib/store';
import { INITIAL_EQUIPMENT } from '@/data/mockData';

export async function GET() {
  const bookings = labStore.getBookings();
  return NextResponse.json({
    success: true,
    total: bookings.length,
    data: bookings
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = CreateBookingSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validated.error.format() },
        { status: 400 }
      );
    }

    const eq = INITIAL_EQUIPMENT.find(e => e.id === validated.data.equipmentId);
    if (!eq) {
      return NextResponse.json({ error: 'Equipment not found' }, { status: 404 });
    }

    const { booking, hasConflict, conflictCase } = labStore.addBooking({
      ...validated.data,
      equipmentName: eq.name,
    });

    return NextResponse.json({
      success: true,
      data: booking,
      hasConflict,
      conflictCase: conflictCase || null,
      message: hasConflict 
        ? 'Booking submitted, but a time overlap conflict was detected. It has been routed to the AI Fair Allocation Engine.' 
        : 'Slot request created successfully and forwarded to faculty guide for approval.'
    }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal error';
    return NextResponse.json({ error: 'Failed to process booking', message }, { status: 500 });
  }
}
