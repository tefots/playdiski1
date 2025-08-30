'use client';

// src/app/page.tsx
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Define Match type based on Prisma schema
interface Match {
  id: number;
  homeTeam: string;
  awayTeam: string;
  league: string;
  startTime: string;
  closingTime: string;
  prizeBase: number;
  paidEntries: number;
  status: string;
  actualStats?: any;
}

// Fetch matches from API route
async function getMatches(): Promise<Match[]> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  console.log('Fetching matches from:', `${baseUrl}/api/matches`); // Debug log
  const res = await fetch(`${baseUrl}/api/matches`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch matches: ${res.statusText}`);
  }
  return res.json();
}

// Component for countdown timer
function CountdownTimer({ closingTime }: { closingTime: string }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const diff = new Date(closingTime).getTime() - now.getTime();
      if (diff <= 0) {
        setTimeLeft('Closed');
        return;
      }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [closingTime]);

  return <p className="text-sm text-gray-600">Closing: {timeLeft}</p>;
}

function MatchCardHeader({ title, league }: { title: string; league: string }) {
  return (
    <div className="p-6 border-b">
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      <p className="text-sm text-gray-500">{league}</p>
    </div>
  );
}

function MatchCardContent({
  prize,
  closingTime,
  questions,
}: {
  prize: number;
  closingTime: string;
  questions: string[];
}) {
  const options = ['0', '1', '2', '3', '4', '5', '6', '7 or more'];

  return (
    <div className="p-6">
      <p className="text-lg font-bold text-green-600">Winning Money: R{prize.toLocaleString()}</p>
      <CountdownTimer closingTime={closingTime} />
      <div className="mt-4">
        <h3 className="text-lg font-medium mb-2">Questions (First 6)</h3>
        <ul className="space-y-4">
          {questions.map((label, index) => (
            <li key={index} className="border p-4 rounded-md">
              <p className="font-medium">{index + 1}. {label}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {options.map((option) => (
                  <span
                    key={option}
                    className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    aria-label={`Option ${option}`}
                  >
                    {option}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function MatchCardFooter({ matchId }: { matchId: number }) {
  return (
    <div className="p-6 border-t flex gap-4">
      <Link href={`/play/${matchId}`}>
        <Button variant="outline">Play for Free</Button>
      </Link>
      <Link href={`/play/${matchId}/paid`}>
        <Button className="bg-blue-600 hover:bg-blue-700">Pay R20 to Play</Button>
      </Link>
    </div>
  );
}

export default async function Home() {
  let matches: Match[] = [];
  let error: string | null = null;

  try {
    matches = await getMatches();
  } catch (err) {
    error = `Failed to load matches: ${err instanceof Error ? err.message : 'Unknown error'}`;
    console.error(error);
  }

  const questionLabels = [
    'Goals by Home Team in 1st Half',
    'Goals by Away Team in 1st Half',
    'Total Goals in 1st Half',
    'Goals by Home Team in 2nd Half',
    'Goals by Away Team in 2nd Half',
    'Total Goals in 2nd Half',
  ];

  return (
    <div className="container mx-auto p-4 min-h-screen bg-gray-50">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 text-center">Playdiski</h1>
        <nav className="flex justify-center gap-6 mt-4">
          <Link href="/about" className="text-blue-600 hover:underline text-lg font-medium">
            About Us
          </Link>
          <Link href="/how-it-works" className="text-blue-600 hover:underline text-lg font-medium">
            How it Works
          </Link>
          <Link href="/faqs" className="text-blue-600 hover:underline text-lg font-medium">
            FAQs
          </Link>
          <Link href="/results" className="text-blue-600 hover:underline text-lg font-medium">
            Results
          </Link>
        </nav>
      </header>
      <main>
        {error ? (
          <div className="text-center py-12">
            <p className="text-lg text-red-600">{error}</p>
          </div>
        ) : matches.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">No active matches available. Check back soon!</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {matches.map((match) => (
              <Card
                key={match.id}
                className="shadow-lg hover:shadow-xl transition-shadow duration-300"
                aria-labelledby={`match-${match.id}`}
              >
                <MatchCardHeader
                  title={`${match.homeTeam} vs ${match.awayTeam}`}
                  league={match.league}
                />
                <MatchCardContent
                  prize={match.prizeBase + match.paidEntries * 5}
                  closingTime={match.closingTime}
                  questions={questionLabels}
                />
                <MatchCardFooter matchId={match.id} />
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}