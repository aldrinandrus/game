import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

export const ReactionGame = ({ onComplete }: { onComplete: (points: number) => void }) => {
  const [gameState, setGameState] = useState<'waiting' | 'ready' | 'click' | 'complete'>('waiting');
  const [startTime, setStartTime] = useState(0);
  const [reactionTime, setReactionTime] = useState(0);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const startGame = () => {
    setGameState('ready');
    // Random delay between 1-5 seconds
    const delay = Math.random() * 4000 + 1000;
    const timeout = setTimeout(() => {
      setStartTime(Date.now());
      setGameState('click');
    }, delay);
    setTimeoutId(timeout);
  };

  const handleClick = () => {
    if (gameState === 'ready') {
      // Clicked too early
      if (timeoutId) clearTimeout(timeoutId);
      toast({
        title: "Too Early! 😅",
        description: "Wait for the color to change!",
        variant: "destructive",
      });
      setGameState('waiting');
      return;
    }

    if (gameState === 'click') {
      const endTime = Date.now();
      const reaction = endTime - startTime;
      setReactionTime(reaction);
      setGameState('complete');

      // Calculate points based on reaction time
      const points = Math.max(1, Math.floor(20 - (reaction / 100)));
      onComplete(points);
      
      toast({
        title: `${reaction}ms! 🚀`,
        description: `You earned ${points} points!`,
      });
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [timeoutId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Click Challenge</CardTitle>
        <CardDescription>
          Click when the box turns green! But don't click too early...
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div 
          className={`
            w-full aspect-square rounded-lg transition-colors duration-100 cursor-pointer
            flex items-center justify-center text-center p-4
            ${gameState === 'waiting' ? 'bg-secondary' : ''}
            ${gameState === 'ready' ? 'bg-red-500' : ''}
            ${gameState === 'click' ? 'bg-green-500' : ''}
            ${gameState === 'complete' ? 'bg-blue-500' : ''}
          `}
          onClick={handleClick}
        >
          {gameState === 'waiting' && (
            <p className="text-lg font-medium">Click to Start</p>
          )}
          {gameState === 'ready' && (
            <p className="text-lg font-medium text-white">Wait...</p>
          )}
          {gameState === 'click' && (
            <p className="text-lg font-medium text-white">CLICK NOW!</p>
          )}
          {gameState === 'complete' && (
            <div className="text-white">
              <p className="text-3xl font-bold mb-2">{reactionTime}ms</p>
              <Button
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  setGameState('waiting');
                }}
              >
                Try Again
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
