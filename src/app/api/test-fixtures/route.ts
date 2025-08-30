// src/app/api/test-fixtures/route.ts
import { NextResponse } from 'next/server';
import { getUpcomingFixtures } from '@/lib/apiFootball';

export async function GET() {
  try {
    const fixtures = await getUpcomingFixtures(39, 2025); // Premier League, 2025 season
    return NextResponse.json({ message: 'Fixtures fetched', fixtures });
  } catch (error) {
    console.error('Error fetching fixtures:', error);
    return NextResponse.json({ error: 'Failed to fetch fixtures' }, { status: 500 });
  }
}