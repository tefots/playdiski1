// src/emails/EntryRecord.tsx
import * as React from 'react';

export interface EntryRecordProps {
  name: string;
  answers: Record<string, string>;
  match: string;
}

export function EntryRecord({ name, answers, match }: EntryRecordProps) {
  return (
    <div>
      <h1>Hi {name},</h1>
      <p>Your entry for {match}:</p>
      <ul>{Object.entries(answers).map(([q, a]) => <li key={q}>{q}: {a}</li>)}</ul>
    </div>
  );
}