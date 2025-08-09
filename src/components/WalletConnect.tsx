import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from 'wagmi'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/hooks/use-toast'
import { useMemo } from 'react'
import { opBNBTestnet } from '@/lib/wagmi'
import { Wallet, LogOut, RefreshCw, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

function truncateAddress(addr?: string) {
  if (!addr) return ''
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`
}

const WalletConnect = () => {
  const { address, isConnected } = useAccount()
  const { connectors, connect, isPending: isConnecting } = useConnect()
  const { disconnect } = useDisconnect()
  const chainId = useChainId()
  const { switchChain, isPending: isSwitching } = useSwitchChain()

  const metaMask = useMemo(() => connectors.find(c => c.id === 'injected'), [connectors])
  
  const onConnect = async () => {
    try {
      await connect({ connector: metaMask ?? connectors[0] })
      toast({ title: 'Wallet connected', description: 'MetaMask connected successfully.' })
    } catch (err: any) {
      toast({ title: 'Connection failed', description: err?.message ?? 'Please try again.', variant: 'destructive' })
    }
  }

  const onDisconnect = () => {
    disconnect()
    toast({ title: 'Signed out', description: 'Wallet disconnected successfully.' })
  }

  const onSwitchToOpBNB = async () => {
    try {
      await switchChain({ chainId: opBNBTestnet.id })
      toast({ title: 'Network switched', description: 'Connected to opBNB Testnet.' })
    } catch (err: any) {
      toast({ title: 'Network switch failed', description: err?.message ?? 'Please try again.', variant: 'destructive' })
    }
  }

  if (!isConnected) {
    return (
      <Button 
        variant="hero" 
        size="lg" 
        onClick={onConnect} 
        disabled={isConnecting}
        className="bg-gradient-to-r from-brand-1 to-brand-2 hover:from-brand-1/90 hover:to-brand-2/90 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
      >
        <Wallet className="w-5 h-5 mr-2" />
        {isConnecting ? 'Connecting…' : 'Connect MetaMask'}
      </Button>
    )
  }

  const needsNetworkSwitch = chainId !== opBNBTestnet.id

  return (
    <div className="flex items-center gap-3">
      {needsNetworkSwitch ? (
        <Button 
          variant="secondary"
          size="sm"
          onClick={onSwitchToOpBNB}
          disabled={isSwitching}
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200"
        >
          <RefreshCw className={cn("w-4 h-4 mr-2", isSwitching && "animate-spin")} />
          {isSwitching ? 'Switching...' : 'Switch Network'}
        </Button>
      ) : (
        <Badge className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-md font-medium">
          <CheckCircle className="w-4 h-4 mr-2" />
          {truncateAddress(address)}
        </Badge>
      )}
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onDisconnect}
        className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 border-red-200 hover:border-red-300 transition-all duration-200"
      >
        <LogOut className="w-4 h-4 mr-2" />
        Sign Out
      </Button>
    </div>
  );
};

export default WalletConnect;
