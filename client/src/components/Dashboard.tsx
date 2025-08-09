import { useState } from 'react';
import { ChallengeCard } from './ChallengeCard.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GamesPage } from './GamesPage';
import { ProtectedRoute } from './ProtectedRoute';
import { Target, Gamepad2, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type Challenge = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
};

const demoData: Challenge[] = [
  {
    id: '1',
    title: 'Scan Someone\'s QR',
    description: 'Find another participant and scan their QR code to make a connection.',
    completed: false
  },
  {
    id: '2',
    title: 'Talk to a Speaker',
    description: 'Have a conversation with one of our featured speakers and get their digital signature.',
    completed: false
  },
  {
    id: '3',
    title: 'Visit 3 Booths',
    description: 'Explore the event by visiting at least three different sponsor or project booths.',
    completed: false
  },
  {
    id: '4',
    title: 'Join a Workshop',
    description: 'Participate in one of our hands-on workshop sessions.',
    completed: false
  }
];

const DashboardContent = () => {
  const [challenges, setChallenges] = useState<Challenge[]>(demoData);

  const handleComplete = async (id: string) => {
    // Simulate contract interaction delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setChallenges(prev => 
      prev.map(challenge => 
        challenge.id === id 
          ? { ...challenge, completed: true }
          : challenge
      )
    );
  };

  return (
    <div className="max-w-7xl mx-auto">
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
            <a href="/games">
              <Gamepad2 className="w-4 h-4 mr-2" />
              Games
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

      <Tabs defaultValue="challenges" className="space-y-8">
        <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          <TabsTrigger 
            value="challenges" 
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:shadow-sm rounded-md transition-all duration-200"
          >
            <Target className="w-4 h-4 mr-2" />
            Challenges
          </TabsTrigger>
          <TabsTrigger 
            value="games" 
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:shadow-sm rounded-md transition-all duration-200"
          >
            <Gamepad2 className="w-4 h-4 mr-2" />
            Mini-Games
          </TabsTrigger>
        </TabsList>

        <TabsContent value="challenges" className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Active Challenges
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Complete these challenges to earn points and climb the leaderboard!
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {challenges.map(challenge => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                onComplete={handleComplete}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="games">
          <GamesPage />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export const Dashboard = () => {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
};
