# Pie.fun Agent

The easiest way to invest in crypto trends—curated token baskets, managed and optimized with AI.

Pie.Fun Agent is based on SolanaAgentKit 🦜️🔗 LangChain + Next.js Starter Template

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/michaelessiet/solana-agent-nextjs-starter-langchain)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsendaifun%2Fsolana-agent-kit%2Ftree%2Fmain%2Fexamples%2Fagent-kit-nextjs-langchain&env=OPENAI_API_KEY,RPC_URL,SOLANA_PRIVATE_KEY&project-name=solana-agent-kit&repository-name=sak-yourprojectname)

## 🚀 Getting Started

First, clone this repo and download it locally.

Next, you'll need to set up environment variables in your repo's `.env.local` file. Copy the `.env.example` file to `.env.local`.
To start, you'll just need to add your OpenAI API key, Solana RPC URL and wallet private key in base 58 string form.

Next, install the required packages using your preferred package manager (e.g. `pnpm`).

```bash
pnpm install
```

Now you're ready to run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result!

## What can the agent do?

The agent can help you buy and sell token baskets on Pie.fun.

You can ask questions like:

- What are baskets are available?
- Buy xx basket worth 1 SOL?
- Show my basket balance
- Sell all my xx basket
- Show Solana top mindshare tokens
