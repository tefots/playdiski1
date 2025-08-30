// src/lib/apiFootball.ts
import { Fixture, MatchStats } from '@/types/types';

export async function getUpcomingFixtures(leagueId: number, season: number): Promise<Fixture[]> {
  const res = await fetch(`https://v3.football.api-sports.io/fixtures?league=${leagueId}&season=${season}&next=10`, {
    headers: {
      'x-rapidapi-key': process.env.API_FOOTBALL_KEY!,
      'x-rapidapi-host': 'v3.football.api-sports.io',
    },
  });
  if (!res.ok) throw new Error(`Failed to fetch fixtures: ${res.statusText}`);
  const data = await res.json();
  return data.response.map((f: any) => {
    const startTime = new Date(f.fixture.date);
    const closingTime = new Date(startTime.getTime() - 60 * 60 * 1000); // 1 hour before start
    return {
      id: f.fixture.id,
      homeTeam: f.teams.home.name,
      awayTeam: f.teams.away.name,
      league: f.league.name,
      startTime: startTime.toISOString(),
      closingTime: closingTime.toISOString(),
      status: 'active', // Align with Prisma schema
    };
  });
}

export async function getMatchStats(fixtureId: number): Promise<MatchStats> {
  const res = await fetch(`https://v3.football.api-sports.io/fixtures?id=${fixtureId}`, {
    headers: {
      'x-rapidapi-key': process.env.API_FOOTBALL_KEY!,
      'x-rapidapi-host': 'v3.football.api-sports.io',
    },
  });
  if (!res.ok) throw new Error(`Failed to fetch stats: ${res.statusText}`);
  const data = await res.json();
  const match = data.response[0];
  const events = match.events || [];
  
  // Goals in first half (up to 45 min + stoppage time)
  const goalsFirstHalf = events.filter((e: any) => e.type === 'Goal' && e.time.elapsed <= 45 + (e.time.extra || 0));
  const goalsSecondHalf = events.filter((e: any) => e.type === 'Goal' && e.time.elapsed > 45 + (e.time.extra || 0));
  
  // Red cards (assuming red cards are marked as "Red Card" in detail)
  const redCardsFirstHalf = events.filter(
    (e: any) => e.type === 'Card' && e.detail === 'Red Card' && e.time.elapsed <= 45 + (e.time.extra || 0)
  );
  const redCardsSecondHalf = events.filter(
    (e: any) => e.type === 'Card' && e.detail === 'Red Card' && e.time.elapsed > 45 + (e.time.extra || 0)
  );

  const homeTeamId = match.teams.home.id;
  const awayTeamId = match.teams.away.id;

  return {
    q1: String(goalsFirstHalf.filter((e: any) => e.team.id === homeTeamId).length),
    q2: String(goalsFirstHalf.filter((e: any) => e.team.id === awayTeamId).length),
    q3: String(goalsFirstHalf.length),
    q4: String(goalsSecondHalf.filter((e: any) => e.team.id === homeTeamId).length),
    q5: String(goalsSecondHalf.filter((e: any) => e.team.id === awayTeamId).length),
    q6: String(goalsSecondHalf.length),
    q7: String(match.goals.home || 0),
    q8: String(match.goals.away || 0),
    q9: String((match.goals.home || 0) + (match.goals.away || 0)),
    q10: String(redCardsFirstHalf.filter((e: any) => e.team.id === homeTeamId).length),
    q11: String(redCardsFirstHalf.filter((e: any) => e.team.id === awayTeamId).length),
    q12: String(redCardsFirstHalf.length),
    q13: String(redCardsSecondHalf.filter((e: any) => e.team.id === homeTeamId).length),
    q14: String(redCardsSecondHalf.filter((e: any) => e.team.id === awayTeamId).length),
    q15: String(redCardsSecondHalf.length),
    q16: String(
      redCardsFirstHalf.filter((e: any) => e.team.id === homeTeamId).length +
      redCardsSecondHalf.filter((e: any) => e.team.id === homeTeamId).length
    ),
    q17: String(
      redCardsFirstHalf.filter((e: any) => e.team.id === awayTeamId).length +
      redCardsSecondHalf.filter((e: any) => e.team.id === awayTeamId).length
    ),
    q18: String(redCardsFirstHalf.length + redCardsSecondHalf.length),
  };
}