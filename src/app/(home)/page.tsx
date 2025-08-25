import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';

// Define Match type based on Prisma schema
interface Match {
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
}

export default async function Home() {
  // Type matches using custom Match interface
  const matches: Match[] = await prisma.match.findMany({
    where: { status: 'active' },
    take: 2,
  });
  const questionLabels = [
    'Goals by Home Team in 1st Half',
    'Goals by Away Team in 1st Half',
    'Total Goals in 1st Half',
    'Goals by Home Team in 2nd Half',
    'Goals by Away Team in 2nd Half',
    'Total Goals in 2nd Half',
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Playdiski</h1>
      <nav className="flex gap-4 mb-8">
        <Link href="/about" className="text-blue-600 hover:underline">About Us</Link>
        <Link href="/how-it-works" className="text-blue-600 hover:underline">How it Works</Link>
        <Link href="/faqs" className="text-blue-600 hover:underline">FAQs</Link>
        <Link href="/results" className="text-blue-600 hover:underline">Results</Link>
      </nav>
      {matches.map((match) => (
        <Card key={match.id}>
          <CardHeader title={`${match.homeTeam} vs ${match.awayTeam}`} league={match.league} />
          <CardContent
            prize={match.prizeBase + match.paidEntries * 5}
            closingTime={match.closingTime.toLocaleString()}
            questions={questionLabels}
          />
          <CardFooter matchId={match.id} />
        </Card>
      ))}
    </div>
  );
}