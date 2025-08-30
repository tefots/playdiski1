// src/app/api/sync-matches/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUpcomingFixtures } from '@/lib/apiFootball';

export async function POST() {
  try {
    // Example: Premier League (ID: 39), season 2025
    const fixtures = await getUpcomingFixtures(39, 2025);
    const matches = fixtures.slice(0, 2).map((fixture) => ({
      homeTeam: fixture.homeTeam,
      awayTeam: fixture.awayTeam,
      league: fixture.league,
      startTime: new Date(fixture.startTime),
      closingTime: new Date(fixture.closingTime),
      prizeBase: 1000,
      paidEntries: 0,
      status: 'active',
    }));

    await prisma.match.deleteMany({ where: { status: 'active' } }); // Clear old active matches
    await prisma.match.createMany({ data: matches });
    console.log('Synced matches:', matches);
    return NextResponse.json({ message: 'Matches synced', matches });
  } catch (error) {
    console.error('Error syncing matches:', error);
    return NextResponse.json({ error: 'Failed to sync matches' }, { status: 500 });
  }
}