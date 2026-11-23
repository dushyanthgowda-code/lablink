import { NextRequest, NextResponse } from 'next/server';
import { EquipmentSearchSchema } from '@/lib/validation';
import { searchEquipmentSemantically } from '@/lib/aiService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const department = searchParams.get('department') || 'All';
    const category = searchParams.get('category') || 'All';

    const validated = EquipmentSearchSchema.safeParse({ query, department, category });
    if (!validated.success) {
      return NextResponse.json({ error: 'Invalid parameters', details: validated.error.format() }, { status: 400 });
    }

    const results = searchEquipmentSemantically(
      validated.data.query || '',
      validated.data.department,
      validated.data.category
    );

    return NextResponse.json({
      success: true,
      total: results.length,
      data: results
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown server error';
    return NextResponse.json({ error: 'Failed to retrieve equipment', message }, { status: 500 });
  }
}
