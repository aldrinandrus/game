import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import QRCodeDialog from "@/components/QRCodeDialog";
import QRScannerDialog from "@/components/QRScannerDialog";
import { toast } from "@/hooks/use-toast";
import { Auth } from "@/components/Auth";
import { Dashboard } from "@/components/Dashboard";
import { useAuth } from "@/lib/hooks/useAuth";
import { UserHeader } from "@/components/ui/UserHeader";
import { WelcomeMessage } from "@/components/WelcomeMessage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Sparkles, Users, Trophy, Zap, ArrowRight, QrCode, Scan, Loader2, Target, Gamepad2 } from "lucide-react";

const Index = () => {
  const { isAuthenticated, user, isLoading, createProfileNFT } = useAuth();
  const [hasProfileNFT, setHasProfileNFT] = useState<boolean | null>(null);
  
  // Check Profile NFT status when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      setHasProfileNFT(user.hasProfileNFT);
    } else {
      setHasProfileNFT(null);
    }
  }, [isAuthenticated, user]);

  const handleScan = (value: string) => {
    // In a full app, verify the QR payload and call the contract to record completion
    toast({ title: "Interaction captured", description: value });
  };

  const handleCreateProfileNFT = async () => {
    await createProfileNFT();
    setHasProfileNFT(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-6 py-8">
        {/* Header with Wallet */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 mb-8 sm:mb-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-brand-1 to-brand-2 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Synqtra
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Gamified networking platform
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-end">
            <ThemeToggle />
            {isAuthenticated && (
              <UserHeader />
            )}
          </div>
        </div>

        {/* Hero Section */}
        {!isAuthenticated && (
          <div className="text-center mb-12 sm:mb-16">
            <div className="max-w-4xl mx-auto px-4">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 sm:mb-6 bg-gradient-to-r from-gray-900 via-brand-1 to-brand-2 bg-clip-text text-transparent">
                Connect. Play. Win.
              </h2>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                Gamified networking for hackathons, conferences, and meetups. Connect by completing IRL challenges, earn points and badges, and climb the live leaderboard.
              </p>
            </div>
          </div>
        )}

        {/* Main Content */}
        {!isAuthenticated ? (
          <Auth />
        ) : isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-brand-1 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Loading your profile...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            {hasProfileNFT ? (
              <>
                <WelcomeMessage />
                <Dashboard />
              </>
            ) : (
              <div className="max-w-2xl mx-auto text-center">
                <div className="mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-brand-1 to-brand-2 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    Welcome to Synqtra!
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                    Let's create your profile NFT to get started on your journey.
                  </p>
                </div>
                
                <Card className="bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-900/80 dark:to-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
                  <CardContent className="p-8">
                    <Button
                      size="lg"
                      onClick={handleCreateProfileNFT}
                      disabled={isLoading}
                      className="bg-gradient-to-r from-brand-1 to-brand-2 hover:from-brand-1/90 hover:to-brand-2/90 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200 text-lg font-semibold px-8 py-4"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Creating Profile...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 mr-2" />
                          Create Profile NFT
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}

        {/* Actions for authenticated users */}
        {isAuthenticated && (
          <div className="space-y-6">
            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-brand-1 to-brand-2 hover:from-brand-1/90 hover:to-brand-2/90 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <a href="/dashboard">
                  <Target className="w-5 h-5 mr-2" />
                  View Dashboard
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-2 border-brand-2 text-brand-2 hover:bg-brand-2 hover:text-white transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <a href="/games">
                  <Gamepad2 className="w-5 h-5 mr-2" />
                  Play Games
                </a>
              </Button>
            </div>
            
            {/* QR Actions */}
            <div className="flex justify-center gap-4">
              <QRCodeDialog value={`synqtra:profile:${user?.address}`} />
              <QRScannerDialog onScan={handleScan} />
            </div>
          </div>
        )}

        {/* Network Status */}
        <div className="flex justify-center mt-12">
          <Badge className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 shadow-md">
            Network: opBNB Testnet
          </Badge>
        </div>

        {/* How it Works */}
        <div className="mt-16 sm:mt-20 max-w-6xl mx-auto px-4">
          <h3 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            How It Works
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <Card className="bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-900/80 dark:to-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-brand-1 to-brand-2 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold">1. Join & Mint</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-base">
                  Mint your Synqtra Profile NFT when you join an event to start earning progress.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-900/80 dark:to-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-brand-2 to-brand-3 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold">2. Connect IRL</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-base">
                  Scan attendee QRs to complete challenges like "meet 3 new builders."
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-900/80 dark:to-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-brand-3 to-brand-1 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold">3. Earn & Climb</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-base">
                  Points unlock NFT badges and move you up the live leaderboard.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-16 text-center">
          <Button variant="link" asChild className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <a href="#" aria-disabled>
              Minting & leaderboard interactions will wire to contracts next.
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
