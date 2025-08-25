// src/lib/apiFootball.ts
import { Fixture, MatchStats } from './../types' // Define types below

export async function getUpcomingFixtures(leagueId: number, season: number): Promise<Fixture[]> {
  const res = await fetch(`https://v3.football.api-sports.io/fixtures?league=${leagueId}&season=${season}&next=10`, {
    headers: {
      'x-rapidapi-key': process.env.API_FOOTBALL_KEY!,
      'x-rapidapi-host': 'v3.football.api-sports.io',
    },
  });
  if (!res.ok) throw new Error('Failed to fetch fixtures');
  const data = await res.json();
  return data.response.map((f: any) => ({
    id: f.fixture.id,
    homeTeam: f.teams.home.name,
    awayTeam: f.teams.away.name,
    league: f.league.name,
    startTime: new Date(f.fixture.date),
    status: f.fixture.status.long,
  }));
}

export async function getMatchStats(fixtureId: number): Promise<MatchStats> {
  const res = await fetch(`https://v3.football.api-sports.io/fixtures?id=${fixtureId}`, {
    headers: {
      'x-rapidapi-key': process.env.API_FOOTBALL_KEY!,
      'x-rapidapi-host': 'v3.football.api-sports.io',
    },
  });
  if (!res.ok) throw new Error('Failed to fetch stats');
  const data = await res.json();
  const match = data.response[0];
  // Simplified: Parse actual stats for 18 questions (goals, red cards)
  const events = match.events || [];
  const goalsFirstHalf = events.filter((e: any) => e.type === 'Goal' && e.time.elapsed <= 45);
  const redCardsFirstHalf = events.filter((e: any) => e.type === 'Card' && e.detail === 'Red Card' && e.time.elapsed <= 45);
  const goalsSecondHalf = events.filter((e: any) => e.type === 'Goal' && e.time.elapsed > 45);
  const redCardsSecondHalf = events.filter((e: any) => e.type === 'Card' && e.detail === 'Red Card' && e.time.elapsed > 45);

  return {
    q1: String(goalsFirstHalf.filter((e: any) => e.team.id === match.teams.home.id).length), // Home goals 1st half
    q2: String(goalsFirstHalf.filter((e: any) => e.team.id === match.teams.away.id).length), // Away goals 1st half
    q3: String(goalsFirstHalf.length), // Total goals 1st half
    q4: String(goalsSecondHalf.filter((e: any) => e.team.id === match.teams.home.id).length),
    q5: String(goalsSecondHalf.filter((e: any) => e.team.id === match.teams.away.id).length),
    q6: String(goalsSecondHalf.length),
    q7: String(match.goals.home), // Total home goals
    q8: String(match.goals.away),
    q9: String(match.goals.home + match.goals.away),
    q10: String(redCardsFirstHalf.filter((e: any) => e.team.id === match.teams.home.id).length),
    q11: String(redCardsFirstHalf.filter((e: any) => e.team.id === match.teams.away.id).length),
    q12: String(redCardsFirstHalf.length),
    q13: String(redCardsSecondHalf.filter((e: any) => e.team.id === match.teams.home.id).length),
    q14: String(redCardsSecondHalf.filter((e: any) => e.team.id === match.teams.away.id).length),
    q15: String(redCardsSecondHalf.length),
    q16: String(redCardsFirstHalf.filter((e: any) => e.team.id === match.teams.home.id).length + redCardsSecondHalf.filter((e: any) => e.team.id === match.teams.home.id).length),
    q17: String(redCardsFirstHalf.filter((e: any) => e.team.id === match.teams.away.id).length + redCardsSecondHalf.filter((e: any) => e.team.id === match.teams.away.id).length),
    q18: String(redCardsFirstHalf.length + redCardsSecondHalf.length),
  };
}