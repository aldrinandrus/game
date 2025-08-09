import { createConfig, http } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { defineChain } from 'viem'

export const opBNBTestnet = defineChain({
  id: 5611,
  name: 'opBNB Testnet',
  network: 'opbnb-testnet',
  nativeCurrency: { name: 'BNB', symbol: 'tBNB', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://opbnb-testnet-rpc.bnbchain.org'] },
    public: { http: ['https://opbnb-testnet-rpc.bnbchain.org'] },
  },
  blockExplorers: {
    default: { name: 'opbnbscan', url: 'https://testnet.opbnbscan.com' },
  },
})

export const config = createConfig({
  chains: [opBNBTestnet],
  connectors: [injected()],
  transports: {
    [opBNBTestnet.id]: http('https://opbnb-testnet-rpc.bnbchain.org'),
  },
})
