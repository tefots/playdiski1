// src/app/api/send-email/route.ts
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { EntryRecord } from '@/emails/EntryRecord';
import React from 'react'; 

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
  const { name, email, answers, match } = await req.json();
  const { data, error } = await resend.emails.send({
    from: 'Socafan <noreply@playdiski.com>',
    to: [email],
    subject: 'Your Entry Record',
    react: React.createElement(EntryRecord, { name, answers, match }),
  });
  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json(data);
}