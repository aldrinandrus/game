import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { CheckCircle, Circle, Target, Sparkles } from 'lucide-react';
import type { Challenge } from './Dashboard';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';

type ChallengeCardProps = {
  challenge: Challenge;
  onComplete: (id: string) => Promise<void>;
};

export const ChallengeCard = ({ challenge, onComplete }: ChallengeCardProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      await onComplete(challenge.id);
      
      // Trigger confetti for challenge completion
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.6 }
      });
      
      toast({
        title: 'Challenge Completed! 🎉',
        description: `You've earned points for completing "${challenge.title}"`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to complete the challenge. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={cn(
      "group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-brand-1/20 hover:-translate-y-1 border-0",
      challenge.completed 
        ? "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20" 
        : "bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50"
    )}>
      {/* Completion badge */}
      {challenge.completed && (
        <div className="absolute top-3 right-3 z-10">
          <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-lg">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        </div>
      )}

      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-1/5 via-transparent to-brand-2/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
            challenge.completed 
              ? "bg-gradient-to-br from-green-500 to-emerald-600" 
              : "bg-gradient-to-br from-brand-1 to-brand-2"
          )}>
            {challenge.completed ? (
              <CheckCircle className="w-5 h-5 text-white" />
            ) : (
              <Target className="w-5 h-5 text-white" />
            )}
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              {challenge.title}
            </CardTitle>
          </div>
        </div>
        <CardDescription className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mt-2">
          {challenge.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0 pb-4">
        <div className="flex items-center gap-2">
          {challenge.completed ? (
            <CheckCircle className="w-4 h-4 text-green-500" />
          ) : (
            <Circle className="w-4 h-4 text-gray-400" />
          )}
          <span className={cn(
            "text-sm font-medium",
            challenge.completed 
              ? "text-green-600 dark:text-green-400" 
              : "text-gray-500 dark:text-gray-400"
          )}>
            {challenge.completed ? 'Completed' : 'Incomplete'}
          </span>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button
          className={cn(
            "w-full transition-all duration-200 group-hover:scale-105",
            challenge.completed
              ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 shadow-md hover:shadow-lg"
              : "bg-gradient-to-r from-brand-1 to-brand-2 hover:from-brand-1/90 hover:to-brand-2/90 text-white border-0 shadow-md hover:shadow-lg"
          )}
          onClick={handleComplete}
          disabled={challenge.completed || isLoading}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing...
            </>
          ) : challenge.completed ? (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Completed!
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Complete Challenge
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
