import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LeaderboardEntry } from '../ui/LeaderboardEntry';
import { type Rank, type LeaderboardEntry as EntryType, rankEmoji, rankColors } from '@/lib/rankingSystem';
import { useAccount } from 'wagmi';
import { Trophy, Medal, Crown } from 'lucide-react';

interface LeaderboardProps {
  entries: EntryType[];
}

const filterEntriesByRank = (entries: EntryType[], rank: Rank) => {
  return entries
    .filter(entry => entry.rank === rank)
    .sort((a, b) => b.totalPoints - a.totalPoints)
    .slice(0, 10);
};

export const Leaderboard = ({ entries }: LeaderboardProps) => {
  const [selectedRank, setSelectedRank] = useState<Rank>('gold');
  const { address } = useAccount();
  const filteredEntries = filterEntriesByRank(entries, selectedRank);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
          Leaderboard
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Top players by rank - climb the ladder and earn rewards!
        </p>
      </div>

      <Card className="bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-900/80 dark:to-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
        <CardContent className="p-6">
          <Tabs value={selectedRank} onValueChange={(value) => setSelectedRank(value as Rank)}>
            <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg mb-6">
              {(['gold', 'silver', 'bronze'] as Rank[]).map(rank => (
                <TabsTrigger
                  key={rank}
                  value={rank}
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:shadow-sm rounded-md transition-all duration-200 flex items-center gap-2"
                >
                  {rank === 'gold' && <Crown className="w-4 h-4 text-yellow-500" />}
                  {rank === 'silver' && <Medal className="w-4 h-4 text-gray-400" />}
                  {rank === 'bronze' && <Medal className="w-4 h-4 text-amber-600" />}
                  {rank.charAt(0).toUpperCase() + rank.slice(1)}
                </TabsTrigger>
              ))}
            </TabsList>

            {(['gold', 'silver', 'bronze'] as Rank[]).map(rank => (
              <TabsContent key={rank} value={rank} className="space-y-4">
                {filterEntriesByRank(entries, rank).map((entry, index) => (
                  <LeaderboardEntry
                    key={entry.address}
                    entry={entry}
                    isCurrentUser={entry.address === address}
                  />
                ))}
                {filteredEntries.length === 0 && (
                  <div className="text-center py-12">
                    <Trophy className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 text-lg">
                      No players in this rank yet
                    </p>
                    <p className="text-gray-400 dark:text-gray-500 text-sm">
                      Be the first to reach this rank!
                    </p>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
