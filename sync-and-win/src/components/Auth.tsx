import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/hooks/useAuth';
import { ArrowLeft, Sparkles, Users, Trophy, Zap, Wallet, Loader2 } from 'lucide-react';

type AuthMode = 'select' | 'signin' | 'signup';

export const Auth = () => {
  const [mode, setMode] = useState<AuthMode>('select');
  const { isAuthenticated, isLoading, signIn } = useAuth();

  const handleSignIn = () => {
    setMode('signin');
  };

  const handleSignUp = () => {
    setMode('signup');
  };

  const handleConnectWallet = async () => {
    await signIn();
  };

  if (isAuthenticated) {
    return null;
  }

  if (mode === 'select') {
    return (
      <div className="w-full max-w-2xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-brand-1 to-brand-2 rounded-full mb-6 shadow-lg">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-4">
            Welcome to Synqtra
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Connect with builders, earn rewards, and climb the leaderboard
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="text-center p-6 rounded-xl bg-gradient-to-br from-white/50 to-gray-50/50 dark:from-gray-900/50 dark:to-gray-800/50 backdrop-blur-sm border border-white/20">
            <Users className="w-8 h-8 text-brand-1 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Connect IRL</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Scan QR codes and meet fellow builders
            </p>
          </div>
          <div className="text-center p-6 rounded-xl bg-gradient-to-br from-white/50 to-gray-50/50 dark:from-gray-900/50 dark:to-gray-800/50 backdrop-blur-sm border border-white/20">
            <Trophy className="w-8 h-8 text-brand-2 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Earn Rewards</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Complete challenges and unlock badges
            </p>
          </div>
          <div className="text-center p-6 rounded-xl bg-gradient-to-br from-white/50 to-gray-50/50 dark:from-gray-900/50 dark:to-gray-800/50 backdrop-blur-sm border border-white/20">
            <Zap className="w-8 h-8 text-brand-3 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Play Games</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Mini-games to boost your score
            </p>
          </div>
        </div>

        {/* Auth Options */}
        <Card className="bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-900/80 dark:to-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold">Get Started</CardTitle>
            <CardDescription>
              Choose how you want to continue your journey
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Button 
              onClick={handleSignIn} 
              className="bg-gradient-to-r from-brand-1 to-brand-2 hover:from-brand-1/90 hover:to-brand-2/90 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200 h-12 text-lg font-semibold"
            >
              Sign In
            </Button>
            <Button 
              onClick={handleSignUp} 
              variant="outline"
              className="border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 h-12 text-lg font-semibold"
            >
              Create New Account
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-900/80 dark:to-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-bold">
            {mode === 'signin' ? 'Welcome Back' : 'Join Synqtra'}
          </CardTitle>
          <CardDescription>
            {mode === 'signin' 
              ? 'Connect your wallet to continue your journey' 
              : 'Connect your wallet to create your profile'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <Button 
            onClick={handleConnectWallet}
            disabled={isLoading}
            className="bg-gradient-to-r from-brand-1 to-brand-2 hover:from-brand-1/90 hover:to-brand-2/90 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200 h-12 text-lg font-semibold"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Wallet className="w-5 h-5 mr-2" />
                Connect MetaMask
              </>
            )}
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => setMode('select')}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
