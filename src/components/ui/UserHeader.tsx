import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RankBadge } from './RankBadge';
import { Wallet, Trophy, User, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { usePointsStore } from '@/lib/stores/useWalletPoints';
import { getRank } from '@/lib/rankingSystem';
import { cn } from '@/lib/utils';

interface UserHeaderProps {
  className?: string;
}

export const UserHeader = ({ className }: UserHeaderProps) => {
  const { user, signOut, isLoading } = useAuth();
  const { totalPoints, gamesPlayed } = usePointsStore();
  
  if (!user) {
    return null;
  }

  const rank = getRank(totalPoints);
  const truncatedAddress = user.displayName || `${user.address.slice(0, 6)}…${user.address.slice(-4)}`;

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <Card className={cn("bg-gradient-to-r from-white/80 to-gray-50/80 dark:from-gray-900/80 dark:to-gray-800/80 backdrop-blur-sm border-0 shadow-lg", className)}>
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-center justify-between">
          {/* User Info */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Avatar className="w-8 h-8 sm:w-12 sm:h-12 border-2 border-brand-1/20 shadow-md">
              <AvatarFallback className="bg-gradient-to-br from-brand-1 to-brand-2 text-white font-bold text-xs sm:text-sm">
                <User className="w-4 h-4 sm:w-6 sm:h-6" />
              </AvatarFallback>
            </Avatar>
            
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1 sm:gap-2">
                <span className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate">
                  {truncatedAddress}
                </span>
                <RankBadge rank={rank} className="hidden sm:flex" />
              </div>
              
              <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Trophy className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
                  <span>{totalPoints} pts</span>
                </div>
                <div className="flex items-center gap-1">
                  <Wallet className="w-3 h-3 sm:w-4 sm:h-4 text-brand-1" />
                  <span>{gamesPlayed} games</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sign Out Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            disabled={isLoading}
            className="text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 border-red-200 hover:border-red-300 transition-all duration-200 p-2"
          >
            <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}; 