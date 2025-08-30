// src/types.ts
export interface Fixture {
  closingTime: string | number | Date;
  id: number;
  homeTeam: string;
  awayTeam: string;
  league: string;
  startTime: Date;
  status: string;
}

export interface MatchStats {
  q1: string; // Goals home 1st half
  q2: string; // Goals away 1st half
  q3: string; // Total goals 1st half
  q4: string; // Goals home 2nd half
  q5: string; // Goals away 2nd half
  q6: string; // Total goals 2nd half
  q7: string; // Total home goals
  q8: string; // Total away goals
  q9: string; // Total match goals
  q10: string; // Red cards home 1st half
  q11: string; // Red cards away 1st half
  q12: string; // Total red cards 1st half
  q13: string; // Red cards home 2nd half
  q14: string; // Red cards away 2nd half
  q15: string; // Total red cards 2nd half
  q16: string; // Total red cards home
  q17: string; // Total red cards away
  q18: string; // Total red cards match
}