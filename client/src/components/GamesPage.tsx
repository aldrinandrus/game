import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TriviaGame } from './games/TriviaGame';
import { MemoryGame } from './games/MemoryGame';
import { ReactionGame } from './games/ReactionGame';
import { RPSGame } from './games/RPSGame';
import { FlappyBird } from './games/FlappyBird';
import { Snake } from './games/Snake';
import { Breakout } from './games/Breakout';
import { gamesData, GameData } from './games/gameData';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { useAccount } from 'wagmi';
import { RankTracker } from './games/RankTracker';
import { Leaderboard } from './games/Leaderboard';
import { getRank, type Rank, type LeaderboardEntry } from '@/lib/rankingSystem';
import { usePointsStore } from '@/lib/stores/useWalletPoints';
import { GameCard } from './ui/GameCard';
import { Trophy, Target, Users, ArrowLeft, Home } from 'lucide-react';

// Simulated leaderboard data - replace with smart contract calls later
const generateDummyLeaderboard = (): LeaderboardEntry[] => {
  return Array.from({ length: 30 }, (_, i) => ({
    address: `0x${Math.random().toString(16).slice(2, 42)}`,
    totalPoints: Math.floor(Math.random() * 150),
    gamesPlayed: Math.floor(Math.random() * 20) + 1,
    rank: 'bronze' as Rank,
    position: i + 1
  })).map(entry => ({
    ...entry,
    rank: getRank(entry.totalPoints)
  }));
};

export const GamesPage = () => {
  const { address } = useAccount();
  const [selectedGame, setSelectedGame] = useState<GameData | null>(null);
  const [completedGames, setCompletedGames] = useState<Record<string, number>>({});
  const [previousRank, setPreviousRank] = useState<Rank>(getRank(0));
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => generateDummyLeaderboard());
  
  // Use our wallet-aware points store
  const { totalPoints, addPoints, getTotalPoints, gamesPlayed, incrementGamesPlayed } = usePointsStore();

  const handleGameComplete = (points: number) => {
    if (selectedGame && address) {
      incrementGamesPlayed();
      const newCompletedGames = {
        ...completedGames,
        [selectedGame.id]: (completedGames[selectedGame.id] || 0) + 1
      };
      setCompletedGames(newCompletedGames);

      // Add points using Zustand store
      addPoints(points);
      const newTotalPoints = getTotalPoints();

      // Update player's entry in leaderboard
      setLeaderboard(prev => {
        const playerEntry = prev.find(entry => entry.address === address);
        const newRank = getRank(newTotalPoints);
        
        if (playerEntry) {
          return prev.map(entry =>
            entry.address === address
              ? {
                  ...entry,
                  totalPoints: newTotalPoints,
                  gamesPlayed: Object.values(newCompletedGames).reduce((a, b) => a + b, 0),
                  rank: newRank
                }
              : entry
          );
        } else {
          return [
            ...prev,
            {
              address,
              totalPoints: newTotalPoints,
              gamesPlayed: 1,
              rank: newRank,
              position: prev.length + 1
            }
          ];
        }
      });

      if (!completedGames[selectedGame.id]) {
        // First time completing this game
        toast({
          title: `${selectedGame.badge} Unlocked! 🏆`,
          description: `You've earned your first ${selectedGame.name} badge!`,
        });
      }

      // Update previous rank for rank-up animation
      setPreviousRank(getRank(totalPoints));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Navigation Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            <a href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </a>
          </Button>
          <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            <a href="/dashboard">
              <Target className="w-4 h-4 mr-2" />
              Dashboard
            </a>
          </Button>
        </div>
        
        <Button
          asChild
          size="sm"
          className="bg-gradient-to-r from-brand-1 to-brand-2 hover:from-brand-1/90 hover:to-brand-2/90 text-white border-0"
        >
          <a href="/">
            <Home className="w-4 h-4 mr-2" />
            Home
          </a>
        </Button>
      </div>

      <Tabs defaultValue="games" className="space-y-8">
        <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          <TabsTrigger value="games" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:shadow-sm rounded-md transition-all duration-200">
            <Target className="w-4 h-4 mr-2" />
            Mini-Games
          </TabsTrigger>
          <TabsTrigger value="rank" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:shadow-sm rounded-md transition-all duration-200">
            <Trophy className="w-4 h-4 mr-2" />
            My Rank
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:shadow-sm rounded-md transition-all duration-200">
            <Users className="w-4 h-4 mr-2" />
            Leaderboard
          </TabsTrigger>
        </TabsList>

        <TabsContent value="games">
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  Mini-Games
                </h2>
                <p className="text-muted-foreground mt-2">
                  Play games, earn points, unlock badges!
                </p>
              </div>
              <Card className="bg-gradient-to-r from-brand-1/10 to-brand-2/10 border-brand-1/20 p-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-brand-1">{totalPoints}</div>
                  <div className="text-sm text-muted-foreground">Total Points</div>
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gamesData.map(game => (
                <GameCard
                  key={game.id}
                  id={game.id}
                  name={game.name}
                  description={game.description}
                  icon={game.icon}
                  plays={completedGames[game.id] || 0}
                  isCompleted={completedGames[game.id] > 0}
                  onPlay={() => setSelectedGame(game)}
                />
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="rank">
          <RankTracker
            totalPoints={totalPoints}
            gamesPlayed={gamesPlayed}
            previousRank={previousRank}
          />
        </TabsContent>

        <TabsContent value="leaderboard">
          <Leaderboard entries={leaderboard} />
        </TabsContent>
      </Tabs>

      <Dialog open={selectedGame !== null} onOpenChange={() => setSelectedGame(null)}>
        <DialogContent className="sm:max-w-[600px] bg-gradient-to-br from-white/95 to-gray-50/95 dark:from-gray-900/95 dark:to-gray-800/95 backdrop-blur-sm border-0 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <span className="text-3xl">{selectedGame?.icon}</span>
              {selectedGame?.name}
            </DialogTitle>
          </DialogHeader>
          
          {selectedGame?.id === 'trivia' && (
            <TriviaGame onComplete={handleGameComplete} />
          )}
          {selectedGame?.id === 'memory' && (
            <MemoryGame onComplete={handleGameComplete} />
          )}
          {selectedGame?.id === 'reaction' && (
            <ReactionGame onComplete={handleGameComplete} />
          )}
          {selectedGame?.id === 'rps' && (
            <RPSGame onComplete={handleGameComplete} />
          )}
          {selectedGame?.id === 'flappy' && (
            <FlappyBird onComplete={handleGameComplete} />
          )}
          {selectedGame?.id === 'snake' && (
            <Snake onComplete={handleGameComplete} />
          )}
          {selectedGame?.id === 'breakout' && (
            <Breakout onComplete={handleGameComplete} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
