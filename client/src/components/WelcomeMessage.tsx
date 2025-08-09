import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Trophy, Wallet } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { usePointsStore } from '@/lib/stores/useWalletPoints';
import { getRank } from '@/lib/rankingSystem';

export const WelcomeMessage = () => {
  const { user } = useAuth();
  const { totalPoints, gamesPlayed } = usePointsStore();
  
  if (!user) return null;

  const rank = getRank(totalPoints);
  const truncatedAddress = user.displayName || `${user.address.slice(0, 6)}…${user.address.slice(-4)}`;

  return (
    <Card className="bg-gradient-to-br from-brand-1/10 to-brand-2/10 border-brand-1/20 shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-brand-1 to-brand-2 rounded-full flex items-center justify-center shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          
          <div className="flex-1">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2">
              Welcome back, {truncatedAddress}! 🎉
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-3">
              Ready to continue your Synqtra journey?
            </p>
            
            <div className="flex flex-wrap gap-3">
              <Badge className="bg-gradient-to-r from-yellow-500 to-amber-600 text-white border-0">
                <Trophy className="w-3 h-3 mr-1" />
                {totalPoints} Points
              </Badge>
              <Badge className="bg-gradient-to-r from-brand-1 to-brand-2 text-white border-0">
                <Wallet className="w-3 h-3 mr-1" />
                {gamesPlayed} Games
              </Badge>
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-600 text-white border-0">
                {rank.charAt(0).toUpperCase() + rank.slice(1)} Rank
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 