import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

// Card component: Wraps match content with border, shadow, and responsive padding
interface CardProps {
  className?: string;
  children: ReactNode;
}

export function Card({ className, children }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border bg-white shadow-sm p-6 mb-6 w-full max-w-2xl mx-auto',
        className
      )}
    >
      {children}
    </div>
  );
}

// CardHeader: Displays match title (e.g., "Barcelona vs Inter Milan") and league
interface CardHeaderProps {
  className?: string;
  title: string;
  league?: string;
}

export function CardHeader({ className, title, league }: CardHeaderProps) {
  return (
    <div className={cn('pb-4 border-b', className)}>
      <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      {league && <p className="text-sm text-gray-500">{league}</p>}
    </div>
  );
}

// CardContent: Shows match details (prize, closing time, question previews, or children)
interface CardContentProps {
  className?: string;
  prize?: number;
  closingTime?: string;
  questions?: string[];
  children?: ReactNode; // Added to allow JSX content
}

export function CardContent({ className, prize, closingTime, questions, children }: CardContentProps) {
  return (
    <div className={cn('py-4', className)}>
      {prize !== undefined && (
        <p className="text-lg font-semibold text-green-600">Winning Money: R{prize.toLocaleString()}</p>
      )}
      {closingTime && <p className="text-sm text-gray-600">Closing: {closingTime}</p>}
      {questions && (
        <div className="mt-4">
          {questions.map((question, index) => (
            <div key={index} className="my-2">
              <p className="text-sm font-medium">Q{index + 1}: {question}</p>
              <div className="flex gap-2 flex-wrap">
                {(index < 9
                  ? ['0', '1', '2', '3', '4', '5', '6', '7 or more']
                  : ['0', '1', '2', '3', '4', '5', '6', '7', '8 or more']
                ).slice(0, 4).map((opt) => (
                  <span key={opt} className="text-xs bg-gray-100 px-2 py-1 rounded">{opt}</span>
                ))}
                <span className="text-xs">...</span>
              </div>
            </div>
          ))}
        </div>
      )}
      {children}
    </div>
  );
}

// CardFooter: Contains action buttons (Play for Free, Pay R20 to Play)
interface CardFooterProps {
  className?: string;
  matchId: number;
}

export function CardFooter({ className, matchId }: CardFooterProps) {
  return (
    <div className={cn('pt-4 flex gap-4', className)}>
      <a
        href={`/play/${matchId}?mode=free`}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
      >
        Play for Free
      </a>
      <a
        href={`/play/${matchId}?mode=paid`}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
      >
        Pay R20 to Play
      </a>
    </div>
  );
}