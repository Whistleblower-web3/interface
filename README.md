<div align="center">
  <img width="1200" alt="Wiki Truth Banner" src="https://github.com/Whistleblower-web3/project-resources/blob/main/image/app-interface-marketplace.jpg" />
  
  <h1>Wiki Truth</h1>
  <p><strong>Decentralized whistleblower bounty and crime evidence marketplace.</strong></p>

  <p>
    <a href="https://oasisprotocol.org/sapphire">
      <img src="https://img.shields.io/badge/Network-Oasis%20Sapphire-blue?style=flat-square" alt="Network" />
    </a>
    <img src="https://img.shields.io/badge/Status-Beta-orange?style=flat-square" alt="Status" />
    <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License" />
  </p>
</div>


# WikiTruth DApp

cloudflare deploy site:[https://app.wikitruth.xyz]

WikiTruth is a decentralized application (DApp) built on Oasis Sapphire, focused on creating a truth market platform for secure evidence storage and trading.

## 🚀 Tech Stack

- **Framework**: React 19 + Vite 6
- **Language**: TypeScript
- **Web3**: Wagmi + Rainbow Kit + Viem
- **UI Library**: Ant Design 5
- **Styling**: TailwindCSS
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Database**: Supabase
- **Blockchain**: Oasis Sapphire (EVM-compatible privacy chain)

## 📋 Prerequisites

- Node.js >= 18.x
- npm >= 9.x (or yarn/pnpm)
- A Web3 wallet (MetaMask, WalletConnect, etc.)

## 🛠️ Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd interface
```

2. Install dependencies:

```bash
npm install
```

## 🏃 Development

Start the development server:

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000) and will automatically open in your browser.

## 📦 Build

Build for production:

```bash
npm run build
```

The build output will be in the `dist/` directory.

## 🔍 Preview

Preview the production build locally:

```bash
npm run preview
```

## 🧹 Lint

Run ESLint to check code quality:

```bash
npm run lint
```

## 🚢 Deployment

The project is configured for static deployment. Build the project and deploy the `dist/` directory to any static hosting service (Vercel, Netlify, Fleek, etc.).

For decentralized deployment on IPFS:

1. Build the project: `npm run build`
2. Upload the `dist/` directory to IPFS
3. Access via IPFS gateway or pinning service

## 🤝 Contributing

1. Follow the code style guidelines
2. Ensure all console logs are in English
3. Run `npm run lint` before committing
4. Test your changes thoroughly

## 📄 License

[Add your license information here]

## 🔗 Links

- [Oasis Sapphire](https://docs.oasis.io/dapp/sapphire/)
- [Wagmi Documentation](https://wagmi.sh/)
- [Rainbow Kit](https://www.rainbowkit.com/)
- [Ant Design](https://ant.design/)
