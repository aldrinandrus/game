import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { WagmiProvider } from 'wagmi'
import { config } from './lib/wagmi'

createRoot(document.getElementById("root")!).render(
  <WagmiProvider config={config}>
    <App />
  </WagmiProvider>
);
