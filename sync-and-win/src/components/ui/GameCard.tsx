import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Trophy, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GameCardProps {
  id: string;
  name: string;
  description: string;
  icon: string;
  plays: number;
  isCompleted?: boolean;
  onPlay: () => void;
  className?: string;
}

export const GameCard = ({
  id,
  name,
  description,
  icon,
  plays,
  isCompleted = false,
  onPlay,
  className
}: GameCardProps) => {
  return (
    <Card 
      className={cn(
        "group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-brand-1/20 hover:-translate-y-1 border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50",
        className
      )}
    >
      {/* Completion badge */}
      {isCompleted && (
        <div className="absolute top-3 right-3 z-10">
          <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-lg">
            <Star className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        </div>
      )}

      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-1/5 via-transparent to-brand-2/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="text-3xl">{icon}</div>
          <div className="flex-1">
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              {name}
            </CardTitle>
          </div>
        </div>
        <CardDescription className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          {description}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Play className="w-4 h-4" />
            <span>{plays} plays</span>
          </div>
          {plays > 0 && (
            <Trophy className="w-4 h-4 text-yellow-500" />
          )}
        </div>

        <Button 
          onClick={onPlay}
          className="w-full bg-gradient-to-r from-brand-1 to-brand-2 hover:from-brand-1/90 hover:to-brand-2/90 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200 group-hover:scale-105"
        >
          <Play className="w-4 h-4 mr-2" />
          Play Now
        </Button>
      </CardContent>
    </Card>
  );
}; 