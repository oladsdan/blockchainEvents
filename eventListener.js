import {ethers, formatUnits} from 'ethers';

import ABI from "./contracts/AutomatedTradingBot.json" assert { type: "json" };;
import dotenv from 'dotenv';

dotenv.config();

let provider;
let contract;


// const provider = new ethers.JsonRpcProvider(process.env.BSC_RPC_URL);
// const provider = new ethers.WebSocketProvider(process.env.BSC_RPC_SOC);
// const contract = new ethers.Contract(process.env.BOT_CONTRACT, ABI, provider);

function connectProvider() {
  try {
    provider = new ethers.WebSocketProvider(process.env.BSC_RPC_SOC);
    contract = new ethers.Contract(process.env.BOT_CONTRACT, ABI, provider);

    console.log("🔌 Connected to BSC WebSocket provider");

    setupListeners();

    provider._websocket.on('close', (code) => {
      console.warn(`⚠️ WebSocket closed with code ${code}. Attempting to reconnect...`);
      reconnect();
    });

    provider._websocket.on('error', (err) => {
      console.error("❌ WebSocket error:", err.message);
      reconnect();
    });
  } catch (err) {
    console.error("❌ Failed to connect WebSocket provider:", err.message);
    setTimeout(connectProvider, 3000); // Retry
  }
}
function reconnect() {
  setTimeout(() => {
    console.log("🔁 Reconnecting...");
    connectProvider();
  }, 3000);
}


const tradeLogs = [];

function setupListeners() {
   contract.removeAllListeners(); // Prevent duplicates on reconnect

  contract.on('TokenBought', (tokenIn, amountIn, tokenOut, amountOut, event) => {
    const readableIn = formatUnits(amountIn, 18);
    const readableOut = formatUnits(amountOut, 18);
    tradeLogs.push({
      type: 'Buy',
      tokenIn,
      amountIn: readableIn,
      amountOut: readableOut,
      timestamp: Date.now(),
      txHash: event.transactionHash,
    });
    console.log(`🟢 BuyExecuted: ${tokenOut}`);
  });

  contract.on('TokenSold', (tokenIn, amountIn, tokenOut,amountOut, event) => {
    const readableIn = formatUnits(amountIn, 18);
    const readableOut = formatUnits(amountOut, 18);
    tradeLogs.push({
      type: 'Sell',
      tokenIn,
      amountIn: readableIn,
      amountOut: readableOut,
      timestamp: Date.now(),
      txHash: event.transactionHash,
    });
    console.log(`🔴 SellExecuted: ${tokenIn}`);
  });

  contract.on('TokenAdded', (token, name, event) => {
    tradeLogs.push({
      type: 'TokenAdded',
      token,
      name,
      timestamp: Date.now(),
      txHash: event.transactionHash,
    });
    console.log(`➕ TokenAdded: ${name}`);
  });

  contract.on('FundsDeposited', (token, amount, event) => {
    const readableAmount = formatUnits(amount, 18)
    tradeLogs.push({
      type: 'Deposit',
      token,
      amount: readableAmount,
      timestamp: Date.now(),
      txHash: event.transactionHash,
    });
    console.log(`💰 DepositMade: ${readableAmount}`);
  });
  
  contract.on('FundsWithdrawn', (token, amount, event) => {
    const readableAmount = formatUnits(amount, 18)
    tradeLogs.push({
      type: 'Withdrawn',
      token,
      amount: readableAmount,
      timestamp: Date.now(),
      txHash: event.transactionHash,
    });
    console.log(`💰 WithdrawnMade: ${readableAmount}`);
  });

  console.log("✅ Event listeners initialized.");
}

function listenToEvents() {
  connectProvider();
}
function getLogs() {
  return tradeLogs.slice(-50).reverse();
}

export { listenToEvents, getLogs };