import { Badge } from '@/components/ui/badge';
import { Trophy, Crown, Medal, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RankBadgeProps {
  rank: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  className?: string;
  showIcon?: boolean;
}

const rankConfig = {
  bronze: {
    gradient: 'from-amber-600 to-orange-700',
    icon: Medal,
    label: 'Bronze'
  },
  silver: {
    gradient: 'from-gray-400 to-gray-600',
    icon: Medal,
    label: 'Silver'
  },
  gold: {
    gradient: 'from-yellow-500 to-amber-600',
    icon: Trophy,
    label: 'Gold'
  },
  platinum: {
    gradient: 'from-cyan-400 to-blue-600',
    icon: Crown,
    label: 'Platinum'
  },
  diamond: {
    gradient: 'from-purple-500 to-pink-600',
    icon: Star,
    label: 'Diamond'
  }
};

export const RankBadge = ({ rank, className, showIcon = true }: RankBadgeProps) => {
  const config = rankConfig[rank];
  const IconComponent = config.icon;

  return (
    <Badge 
      className={cn(
        "bg-gradient-to-r text-white border-0 shadow-lg font-semibold px-3 py-1",
        config.gradient,
        className
      )}
    >
      {showIcon && <IconComponent className="w-3 h-3 mr-1" />}
      {config.label}
    </Badge>
  );
}; 