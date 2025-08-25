'use server';
import { prisma } from '@/lib/prisma';
import { getUpcomingFixtures, getMatchStats } from '@/lib/apiFootball';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { revalidatePath } from 'next/cache';
import { Resend } from 'resend';

// Define Match and Entry types based on Prisma schema
interface Entry {
  id: number;
  matchId: number;
  name: string;
  surname: string;
  email: string;
  optionalEmail?: string;
  phone: string;
  answers: any; // Json type
  isPaid: boolean;
  paymentId?: string;
  createdAt: Date;
}

interface MatchWithEntries {
  id: number;
  homeTeam: string;
  awayTeam: string;
  league: string;
  startTime: Date;
  closingTime: Date;
  prizeBase: number;
  paidEntries: number;
  status: string;
  actualStats?: any; // Json type
  entries: Entry[];
}

export default async function MatchesAdmin() {
  // Type matches with entries relation
  const matches: MatchWithEntries[] = await prisma.match.findMany({
    include: { entries: true },
  });
  const fixtures = await getUpcomingFixtures(39, 2025); // Premier League

  async function addMatch(fixture: any) {
    'use server';
    await prisma.match.create({
      data: {
        homeTeam: fixture.homeTeam,
        awayTeam: fixture.awayTeam,
        league: fixture.league,
        startTime: new Date(fixture.startTime),
        closingTime: new Date(fixture.startTime.getTime() - 2 * 60 * 60 * 1000),
      },
    });
    revalidatePath('/admin/matches');
  }

  async function closeMatch(matchId: number) {
    'use server';
    const stats = await getMatchStats(matchId);
    const match = await prisma.match.update({
      where: { id: matchId },
      data: { actualStats: stats, status: 'completed' },
      include: { entries: true },
    });

    const winners = match.entries.filter(
      (entry: { answers: any; }) => JSON.stringify(entry.answers) === JSON.stringify(stats)
    );
    const prizePerWinner = (match.prizeBase + match.paidEntries * 5) / (winners.length || 1);

    const resend = new Resend(process.env.RESEND_API_KEY!);
    for (const winner of winners) {
      await resend.emails.send({
        from: 'Playdiski <noreply@playdiski.com>',
        to: [winner.email],
        subject: 'Congratulations! You Won!',
        text: `You won R${prizePerWinner.toFixed(2)} for ${match.homeTeam} vs ${match.awayTeam}!`,
      });
    }

    revalidatePath('/admin/matches');
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Manage Matches</h1>
      
      <Card className="mb-8">
        <CardHeader title="Add New Match" />
        <CardContent>
          {fixtures.slice(0, 5).map((fixture) => (
            <div key={fixture.id} className="flex justify-between items-center py-2 border-b">
              <div>
                <p className="font-medium">{fixture.homeTeam} vs {fixture.awayTeam}</p>
                <p className="text-sm text-gray-500">{fixture.league} - {new Date(fixture.startTime).toLocaleString()}</p>
              </div>
              <form action={addMatch.bind(null, fixture)}>
                <Button type="submit" variant="primary">Add Match</Button>
              </form>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="Matches" />
        <CardContent>
          {matches.length === 0 ? (
            <p>No matches found.</p>
          ) : (
            <div className="space-y-4">
              {matches.map((match) => (
                <div key={match.id} className="border p-4 rounded-lg">
                  <p className="font-medium">{match.homeTeam} vs {match.awayTeam}</p>
                  <p className="text-sm text-gray-500">League: {match.league}</p>
                  <p className="text-sm text-gray-500">Status: {match.status}</p>
                  <p className="text-sm text-gray-500">Prize Pool: R{match.prizeBase + match.paidEntries * 5}</p>
                  <p className="text-sm text-gray-500">Entries: {match.entries.length}</p>
                  {match.status === 'active' && (
                    <form action={closeMatch.bind(null, match.id)}>
                      <Button type="submit" variant="destructive" className="mt-2">Close & Compute Winners</Button>
                    </form>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}