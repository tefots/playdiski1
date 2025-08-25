// src/app/api/send-email/route.ts
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { EntryRecord } from '@/emails/EntryRecord';
import { error } from 'console';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: { json: () => PromiseLike<{ name: any; email: any; answers: any; match: any; }> | { name: any; email: any; answers: any; match: any; }; }) {
  const { name, email, answers, match } = await req.json();
  const { data, error } = await resend.emails.send({
    from: 'Playdiski <noreply@playdiski.com>',
    to: [email],
    subject: 'Your Entry Record',
    react: <EntryRecord name={name} answers={answers} match={match} />,
  });
  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json(data);
}