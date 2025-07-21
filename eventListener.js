import {ethers, formatUnits} from 'ethers';

import ABI from './contracts/AutomatedTradingBot.json';
import dotenv from 'dotenv';

dotenv.config();

const provider = new ethers.JsonRpcProvider(process.env.BSC_RPC_URL);
const contract = new ethers.Contract(process.env.BOT_CONTRACT, ABI, provider);

const tradeLogs = [];

function listenToEvents() {
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

export { listenToEvents, getLogs };