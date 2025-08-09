import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { RankBadge } from './RankBadge';
import { Trophy, Medal, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LeaderboardEntry as EntryType } from '@/lib/rankingSystem';

interface LeaderboardEntryProps {
  entry: EntryType;
  isCurrentUser?: boolean;
  className?: string;
}

const getPositionIcon = (position: number) => {
  switch (position) {
    case 1:
      return <Crown className="w-5 h-5 text-yellow-500" />;
    case 2:
      return <Medal className="w-5 h-5 text-gray-400" />;
    case 3:
      return <Medal className="w-5 h-5 text-amber-600" />;
    default:
      return null;
  }
};

export const LeaderboardEntry = ({ entry, isCurrentUser = false, className }: LeaderboardEntryProps) => {
  const truncatedAddress = `${entry.address.slice(0, 6)}…${entry.address.slice(-4)}`;

  return (
    <Card 
      className={cn(
        "transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 border-0",
        isCurrentUser 
          ? "bg-gradient-to-r from-brand-1/10 to-brand-2/10 border-l-4 border-l-brand-1" 
          : "bg-white/50 dark:bg-gray-900/50",
        className
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          {/* Position and User Info */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 min-w-[60px]">
              {getPositionIcon(entry.position)}
              <span className={cn(
                "font-bold text-lg",
                entry.position === 1 && "text-yellow-500",
                entry.position === 2 && "text-gray-400", 
                entry.position === 3 && "text-amber-600",
                entry.position > 3 && "text-gray-600 dark:text-gray-400"
              )}>
                #{entry.position}
              </span>
            </div>

            <Avatar className="w-10 h-10 border-2 border-gray-200 dark:border-gray-700">
              <AvatarFallback className="bg-gradient-to-br from-gray-400 to-gray-600 text-white text-sm font-semibold">
                {truncatedAddress.slice(2, 4)}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col">
              <span className={cn(
                "font-semibold",
                isCurrentUser ? "text-brand-1" : "text-gray-900 dark:text-white"
              )}>
                {truncatedAddress}
              </span>
              <div className="flex items-center gap-2">
                <RankBadge rank={entry.rank} showIcon={false} />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {entry.gamesPlayed} games
                </span>
              </div>
            </div>
          </div>

          {/* Points */}
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span className="font-bold text-lg text-gray-900 dark:text-white">
              {entry.totalPoints}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">pts</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 