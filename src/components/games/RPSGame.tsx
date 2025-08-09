import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

type Move = 'rock' | 'paper' | 'scissors';
type Result = 'win' | 'lose' | 'draw';

const moves: Move[] = ['rock', 'paper', 'scissors'];
const emojis: Record<Move, string> = {
  rock: '🪨',
  paper: '📄',
  scissors: '✂️'
};

const getResult = (playerMove: Move, computerMove: Move): Result => {
  if (playerMove === computerMove) return 'draw';
  if (
    (playerMove === 'rock' && computerMove === 'scissors') ||
    (playerMove === 'paper' && computerMove === 'rock') ||
    (playerMove === 'scissors' && computerMove === 'paper')
  ) {
    return 'win';
  }
  return 'lose';
};

export const RPSGame = ({ onComplete }: { onComplete: (points: number) => void }) => {
  const [playerMove, setPlayerMove] = useState<Move | null>(null);
  const [computerMove, setComputerMove] = useState<Move | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [streak, setStreak] = useState(0);

  const playMove = (move: Move) => {
    const computer = moves[Math.floor(Math.random() * moves.length)];
    setPlayerMove(move);
    setComputerMove(computer);
    const gameResult = getResult(move, computer);
    setResult(gameResult);

    if (gameResult === 'win') {
      const newStreak = streak + 1;
      setStreak(newStreak);
      const points = Math.min(10, newStreak * 2); // More points for win streaks
      onComplete(points);
      toast({
        title: "Victory! 🎉",
        description: `Win streak: ${newStreak} (${points} points)`,
      });
    } else if (gameResult === 'lose') {
      setStreak(0);
      toast({
        title: "Better luck next time!",
        description: "Keep trying!",
        variant: "destructive",
      });
    } else {
      toast({
        title: "It's a draw!",
        description: "Try again!",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rock Paper Scissors</CardTitle>
        <CardDescription>
          Win streak: {streak} {streak > 2 && '🔥'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Game Area */}
        <div className="flex justify-center items-center gap-8 min-h-[100px]">
          <div className="text-4xl">
            {playerMove ? emojis[playerMove] : '🤔'}
          </div>
          <div className="text-2xl font-bold">VS</div>
          <div className="text-4xl">
            {computerMove ? emojis[computerMove] : '🤖'}
          </div>
        </div>

        {/* Result Display */}
        {result && (
          <div className={`text-center text-2xl font-bold
            ${result === 'win' ? 'text-green-500' : ''}
            ${result === 'lose' ? 'text-red-500' : ''}
            ${result === 'draw' ? 'text-yellow-500' : ''}
          `}>
            {result === 'win' && '🎉 You Win!'}
            {result === 'lose' && '😔 You Lose'}
            {result === 'draw' && '🤝 Draw'}
          </div>
        )}

        {/* Move Buttons */}
        <div className="grid grid-cols-3 gap-3">
          {moves.map((move) => (
            <Button
              key={move}
              variant={playerMove === move ? "default" : "outline"}
              onClick={() => playMove(move)}
              className="h-16 text-xl"
            >
              {emojis[move]}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
