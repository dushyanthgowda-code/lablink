import { NextResponse } from 'next/server';
import { labStore } from '@/lib/store';

export async function GET() {
  const conflicts = labStore.getConflicts();
  return NextResponse.json({
    success: true,
    total: conflicts.length,
    data: conflicts
  });
}
