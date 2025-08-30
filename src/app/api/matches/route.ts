// src/app/api/matches/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const matches = await prisma.match.findMany({
      where: { status: 'active' },
      take: 2,
    });
    console.log('Fetched matches:', matches); // Debug log
    return NextResponse.json(matches);
  } catch (error) {
    console.error('Error fetching matches:', error);
    return NextResponse.json({ error: 'Failed to fetch matches' }, { status: 500 });
  }
}