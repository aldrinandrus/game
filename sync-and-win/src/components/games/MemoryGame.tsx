import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

const icons = ['🌐', '⛓️', '🔐', '💎', '🚀', '💰', '🎮', '🔑'];
const createBoard = () => {
  const pairs = [...icons, ...icons];
  return pairs.sort(() => Math.random() - 0.5).map((icon, index) => ({
    id: index,
    icon,
    flipped: false,
    matched: false
  }));
};

export const MemoryGame = ({ onComplete }: { onComplete: (points: number) => void }) => {
  const [cards, setCards] = useState(createBoard());
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    if (flipped.length === 2) {
      setIsLocked(true);
      const [first, second] = flipped;

      if (cards[first].icon === cards[second].icon) {
        setCards(prev => 
          prev.map((card, index) => 
            index === first || index === second
              ? { ...card, matched: true }
              : card
          )
        );
        setMatches(m => m + 1);
        setFlipped([]);
        setIsLocked(false);
      } else {
        setTimeout(() => {
          setFlipped([]);
          setIsLocked(false);
        }, 1000);
      }
      setMoves(m => m + 1);
    }
  }, [flipped, cards]);

  useEffect(() => {
    if (matches === icons.length) {
      const points = Math.max(5, Math.floor(100 - (moves * 5))); // More points for fewer moves
      onComplete(points);
      toast({
        title: "Memory Master! 🎉",
        description: `Game complete in ${moves} moves! You earned ${points} points!`,
      });
    }
  }, [matches, moves, onComplete]);

  const handleClick = (index: number) => {
    if (!isLocked && !cards[index].matched && !flipped.includes(index)) {
      if (flipped.length < 2) {
        setFlipped([...flipped, index]);
        setCards(prev => 
          prev.map((card, i) => 
            i === index ? { ...card, flipped: true } : card
          )
        );
      }
    }
  };

  const resetGame = () => {
    setCards(createBoard());
    setFlipped([]);
    setMoves(0);
    setMatches(0);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Memory Match</CardTitle>
        <CardDescription>
          Moves: {moves} | Matches: {matches}/{icons.length}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-2 mb-4">
          {cards.map((card, index) => (
            <button
              key={card.id}
              onClick={() => handleClick(index)}
              className={`
                aspect-square text-2xl flex items-center justify-center
                rounded-lg transition-all transform duration-300
                ${card.flipped || card.matched
                  ? 'bg-primary text-primary-foreground rotate-0'
                  : 'bg-secondary rotate-y-180'
                }
                ${card.matched ? 'opacity-50' : ''}
                hover:opacity-90
              `}
              disabled={card.matched || isLocked}
            >
              {(card.flipped || card.matched) ? card.icon : ''}
            </button>
          ))}
        </div>
        <Button onClick={resetGame} className="w-full">
          Reset Game
        </Button>
      </CardContent>
    </Card>
  );
};
