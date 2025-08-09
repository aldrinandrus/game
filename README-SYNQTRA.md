# Synqtra – Fullstack dApp (opBNB Testnet)

This repo contains everything to run Synqtra:
- frontend/ (this Lovable project root is the frontend app)
- contracts/ (Hardhat + Solidity)
- backend/ (optional Node.js + Express API)
- scripts/ (notes for deploy scripts)

Quick Start
1) Frontend (MetaMask + Wagmi)
- Run dev server in Lovable or locally:
  npm i
  npm run dev
- MetaMask network: opBNB Testnet
  Chain ID: 5611
  RPC: https://opbnb-testnet-rpc.bnbchain.org
  Explorer: https://testnet.opbnbscan.com
- The homepage lets you connect your wallet, show your QR, and scan others.

2) Contracts (Hardhat on opBNB Testnet)
- cd contracts
- cp .env.example .env and fill:
  - OPBNB_TESTNET_RPC=https://opbnb-testnet-rpc.bnbchain.org
  - PRIVATE_KEY=your_private_key
- npm i
- npm run build
- npm run deploy:opbnb-testnet
- Deployed addresses will print in the console.

3) Backend (optional Express)
- cd backend
- cp .env.example .env (fill PORT and optional Greenfield vars)
- npm i
- npm run dev
- Endpoint: POST /qr/verify — stubbed QR verification.

4) BNB Greenfield (storage)
- Use the official SDK (@bnb-chain/greenfield-js-sdk) from the backend to store event metadata, scans, and profile content.
- Suggested flow: upload event JSON to a Greenfield bucket; store object keys in contracts or off-chain cache.

Notes
- Frontend uses public opBNB testnet RPC; no env needed in Lovable. For local, you can add a .env with VITE_* variables if desired.
- Contracts are minimal/reference implementations. Extend with access control, event-specific rules, and contract-to-contract integrations as needed.
