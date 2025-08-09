import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { getRank, rankEmoji, rankColors, type Rank } from '@/lib/rankingSystem';
import confetti from 'canvas-confetti';

interface RankTrackerProps {
  totalPoints: number;
  gamesPlayed: number;
  previousRank?: Rank;
}

export const RankTracker = ({ totalPoints, gamesPlayed, previousRank }: RankTrackerProps) => {
  const currentRank = getRank(totalPoints);
  const nextRankThreshold = currentRank === 'bronze' ? 50 : currentRank === 'silver' ? 100 : Infinity;
  const progress = currentRank === 'gold' ? 100 : (totalPoints / nextRankThreshold) * 100;

  // Show confetti on rank up
  if (previousRank && currentRank !== previousRank) {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }

  return (
    <Card className={`${rankColors[currentRank].bg} ${rankColors[currentRank].border}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">{rankEmoji[currentRank]}</span>
          <span className={rankColors[currentRank].text}>
            {currentRank.charAt(0).toUpperCase() + currentRank.slice(1)} Rank
          </span>
        </CardTitle>
        <CardDescription>Games Played: {gamesPlayed}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span>Total Points: {totalPoints}</span>
            {currentRank !== 'gold' && (
              <span>Next Rank: {nextRankThreshold - totalPoints} points needed</span>
            )}
          </div>
          <Progress value={progress} className="h-2" />
          {currentRank !== 'gold' && (
            <p className="text-sm text-muted-foreground">
              Reach {nextRankThreshold} points to rank up to{' '}
              {currentRank === 'bronze' ? 'Silver' : 'Gold'}!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
