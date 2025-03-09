import { ListBasketTokensResponse } from "./types";
import { Connection, PublicKey, VersionedTransaction } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {
  BN,
  BuySwapData,
  PieProgram,
  TokenInfo,
} from "@ao-labs/pie-dot-fun-solana";
import { SolanaAgentKit } from "@/src/agent";
import { Wallet } from "@/src/utils/keypair";

const connection = new Connection(process.env.RPC_URL!);
const pieProgram = new PieProgram(
  connection,
  "mainnet-beta",
  process.env.RPC_URL!,
);

export async function listAllBaskets() {
  const response = await fetch(
    "https://api.internal-pie.fun/v1/basketTokens?filter=state=LISTED",
  );
  const data: ListBasketTokensResponse = await response.json();
  return data;
}

export async function getAllBasketTokenBalance(owner: string) {
  const baskets = await listAllBaskets();
  const basketTokenAddresses = baskets.basketTokens.map(
    (basket) => basket.address,
  );
  const connection = new Connection(process.env.RPC_URL!);
  const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
    new PublicKey(owner),
    {
      programId: TOKEN_PROGRAM_ID,
    },
  );

  console.log(tokenAccounts.value);

  const filteredTokenAccounts = tokenAccounts.value
    .filter((tokenAccount) =>
      basketTokenAddresses.includes(tokenAccount.account.data.parsed.info.mint),
    )
    .map((tokenAccount) => ({
      mint: tokenAccount.account.data.parsed.info.mint,
      owner: tokenAccount.account.data.parsed.info.owner,
      tokenAmount: tokenAccount.account.data.parsed.info.tokenAmount,
      tokenName: baskets.basketTokens.find(
        (basket) =>
          basket.address === tokenAccount.account.data.parsed.info.mint,
      )?.displayName,
    }));

  console.log(filteredTokenAccounts);
  return filteredTokenAccounts;
}

export async function buyBasket(agent: SolanaAgentKit) {
  await pieProgram.init();
  const wallet = new Wallet(agent.wallet);

  //@TODO: let agent handle the input params
  const basketId = "4";
  const basketAddress = "4qXQWiiJvA1PyTSunUF9wwyQuVVP5khXT7KNZc68t9y6";
  const amount = 100000000;
  const priceRes = await fetch(
    `https://api.internal-pie.fun/v1/basketTokens/SOLANA/${basketAddress}/market?currency=CURRENCY_SOL`,
  );
  const priceData = await priceRes.json();
  const basketPriceInLamports = priceData?.value?.rawAmount;

  const {
    finalInputSolRequiredInLamports,
    revisedSwapData,
    finalBasketAmountInRawDecimal,
  } = await pieProgram.calculateOptimalInputAmounts({
    basketId,
    userInputInLamports: amount.toString(),
    basketPriceInLamports: basketPriceInLamports,
    slippagePct: 10,
    feePct: 1,
    bufferPct: 5,
  });

  console.info({
    finalInputSolRequiredInLamports,
    revisedSwapData,
    finalBasketAmountInRawDecimal,
  });

  const serializedTxs = await pieProgram.createBuyAndMintBundle({
    user: wallet.publicKey,
    basketId: new BN(basketId),
    slippage: 10,
    mintAmount: finalBasketAmountInRawDecimal,
    buySwapData: revisedSwapData,
    swapsPerBundle: 2,
    tokenInfo: await getTokenListFromSolanaClient(),
    inputAmount: finalInputSolRequiredInLamports,
  });

  const serializedSignedTxs: string[] = [];

  for (const serializedTx of serializedTxs) {
    const tx = pieProgram.jito.signSerializedTransaction(
      serializedTx,
      agent.wallet,
    );
    serializedSignedTxs.push(tx);
  }

  console.log("start simulating bundle...");
  const bundleSimluationResult = await pieProgram.jito.simulateBundle({
    encodedTransactions: serializedSignedTxs,
  });

  console.log(
    `bundle simulation result: ${JSON.stringify(
      bundleSimluationResult?.value,
    )}`,
  );

  if (bundleSimluationResult?.value.summary !== "succeeded") {
    throw new Error("bundle simulation failed");
  }

  const bundleId = await pieProgram.jito.sendBundle(serializedSignedTxs);
  console.log(`bundle sent with id: ${bundleId}`);

  return {
    status: "success",
    bundleId,
  };
}

export async function sellBasket(agent: SolanaAgentKit) {
  await pieProgram.init();

  console.log("selling basket...");
  const wallet = new Wallet(agent.wallet);

  //@TODO: let agent handle the input params
  const basketId = "4";
  const basketAddress = "4qXQWiiJvA1PyTSunUF9wwyQuVVP5khXT7KNZc68t9y6";

  let serializedTxs: string[] = [];
  const tokenInfo = await getTokenListFromSolanaClient();
  const redeemAmount = await pieProgram.getTokenBalance({
    mint: new PublicKey(basketAddress),
    owner: wallet.publicKey,
  });

  console.log({ tokenInfo });
  try {
    serializedTxs = await pieProgram.createRedeemAndSellBundle({
      user: wallet.publicKey,
      basketId: new BN(basketId),
      slippage: 10,
      redeemAmount,
      swapsPerBundle: 2,
      tokenInfo,
    });
  } catch (error: any) {
    console.error(error);
    throw new Error("error creating sell basket bundle");
  }

  console.log({ serializedTxs });

  const serializedSignedTxs: string[] = [];
  for (const serializedTx of serializedTxs) {
    const tx = pieProgram.jito.signSerializedTransaction(
      serializedTx,
      agent.wallet,
    );
    serializedSignedTxs.push(tx);
  }

  console.log("start simulating bundle...");
  const bundleSimluationResult = await pieProgram.jito.simulateBundle({
    encodedTransactions: serializedSignedTxs,
  });

  console.log(
    `bundle simulation result: ${JSON.stringify(
      bundleSimluationResult?.value,
    )}`,
  );

  if (bundleSimluationResult?.value.summary !== "succeeded") {
    throw new Error("bundle simulation failed");
  }

  const bundleId = await pieProgram.jito.sendBundle(serializedSignedTxs);
  console.log(`bundle sent with id: ${bundleId}`);

  return {
    status: "success",
    bundleId,
  };
}

export const getTokenListFromSolanaClient = async (): Promise<TokenInfo[]> => {
  const response = await fetch(
    "https://pie-program-client-1032702417000.asia-east1.run.app/v1/pie-program/token-pools",
  );
  const data = await response.json();
  console.log({ data });
  return data.map((token: any) => ({
    name: token.name,
    mint: token.mint.toString(),
    poolId: token.poolId.toString(),
    lut: token.lookupTable.toString(),
    type:
      token.poolType === "POOL_TYPE_AMM"
        ? "amm"
        : token.poolType === "POOL_TYPE_CLMM"
          ? "clmm"
          : "cpmm",
  }));
};
