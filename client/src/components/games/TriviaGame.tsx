import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { triviaQuestions } from './gameData';
import { toast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';

export const TriviaGame = ({ onComplete }: { onComplete: (points: number) => void }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleAnswer = (selectedIndex: number) => {
    const isCorrect = selectedIndex === triviaQuestions[currentQuestion].correct;
    if (isCorrect) {
      setScore(score + 1);
      toast({
        title: "Correct! 🎉",
        description: "Keep going!",
      });
    } else {
      toast({
        title: "Not quite right",
        description: "Try the next one!",
        variant: "destructive",
      });
    }

    if (currentQuestion < triviaQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setIsComplete(true);
      const points = score * 5; // 5 points per correct answer
      onComplete(points);
      
      // Trigger confetti for game completion
      setTimeout(() => {
        triggerConfetti();
      }, 100);
      
      toast({
        title: "Quiz Complete! 🎓",
        description: `You scored ${score}/${triviaQuestions.length} and earned ${points} points!`,
      });
    }
  };

  if (isComplete) {
    return (
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-0 shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Quiz Complete! 🎓
          </CardTitle>
          <CardDescription className="text-lg">
            You scored {score}/{triviaQuestions.length}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <div className="text-4xl mb-4">
            {score === triviaQuestions.length ? '🏆 Perfect Score!' : '👏 Well Done!'}
          </div>
          <div className="bg-gradient-to-r from-brand-1/10 to-brand-2/10 rounded-lg p-4">
            <p className="text-lg font-semibold text-brand-1">
              +{score * 5} Points Earned!
            </p>
          </div>
          <Button 
            onClick={() => {
              setCurrentQuestion(0);
              setScore(0);
              setIsComplete(false);
            }}
            className="w-full bg-gradient-to-r from-brand-1 to-brand-2 hover:from-brand-1/90 hover:to-brand-2/90 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Play Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  const question = triviaQuestions[currentQuestion];

  return (
    <Card className="bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-900/80 dark:to-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          Question {currentQuestion + 1}/{triviaQuestions.length}
        </CardTitle>
        <CardDescription className="text-base">
          Score: {score}/{triviaQuestions.length}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-lg font-medium text-gray-900 dark:text-white">{question.question}</p>
        <div className="grid gap-3">
          {question.options.map((option, index) => (
            <Button
              key={index}
              variant="outline"
              className="justify-start h-auto py-4 px-4 text-left hover:bg-brand-1/5 hover:border-brand-1/30 transition-all duration-200"
              onClick={() => handleAnswer(index)}
            >
              {option}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
