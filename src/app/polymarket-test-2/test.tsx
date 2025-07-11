'use client';

import { useCallback, useEffect, useState } from 'react';
import { ethers, Contract } from 'ethers';
import {
  Container,
  Typography,
  Button,
  Box,
  TextField,
  Stack,
  Alert,
  Grid,
} from '@mui/material';
import { getPolyMarketContract2 } from '@/lib/contract';
import { usdcABI, usdcAddress } from '@/lib/usdc';

export default function Page() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [account, setAccount] = useState('');
  const [admin, setAdmin] = useState('');
  const [question, setQuestion] = useState('');
  const [liquidity, setLiquidity] = useState('');
  const [contract, setContract] = useState<any>(null);
  const [alert, setAlert] = useState('');
  const [markets, setMarkets] = useState<any[]>([]);

  const connectWallet = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const c = getPolyMarketContract2(signer);
      const adminAddr = await c.owner();

      setAccount(accounts[0]);
      setContract(c);
      setAdmin(adminAddr);
      setWalletConnected(true);
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
      setAlert('Failed to connect wallet');
    }
  };

  const createMarket = async () => {
    try {
      if (!contract) throw new Error('No contract connected');
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const usdc = new ethers.Contract(usdcAddress, usdcABI, signer);

      const liquidityAmount = ethers.parseUnits(liquidity, 6);
      const contractAddress = await contract.getAddress();
      const userAddress = await signer.getAddress();
      const balance = await usdc.balanceOf(userAddress);
      const allowance = await usdc.allowance(userAddress, contractAddress);

      if (balance < liquidityAmount)
        throw new Error('Insufficient USDC balance');
      if (allowance < liquidityAmount) {
        const approval = await usdc.approve(contractAddress, liquidityAmount);
        await approval.wait();
      }

      const tx = await contract.createMarket(question, liquidityAmount);
      await tx.wait();

      setAlert('Market created!');
      setQuestion('');
      setLiquidity('');
      fetchAllMarkets();
    } catch (err) {
      console.error(err);
      setAlert('Transaction failed');
    }
  };

  const buyShares = async (marketId: number, option: number) => {
    try {
      if (!contract) throw new Error('No contract connected');
      const usdcAmount = prompt('Enter USDC amount to spend:');
      if (!usdcAmount || isNaN(Number(usdcAmount))) return;

      const amount = ethers.parseUnits(usdcAmount, 6);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const usdc = new ethers.Contract(usdcAddress, usdcABI, signer);
      const contractWithSigner = contract.connect(signer);
      const contractAddress = await contract.getAddress();
      const userAddress = await signer.getAddress();

      const allowance = await usdc.allowance(userAddress, contractAddress);
      if (allowance < amount) {
        const approval = await usdc.approve(contractAddress, amount);
        await approval.wait();
      }

      const tx = await contractWithSigner.buyShares(marketId, option, amount);
      await tx.wait();

      setAlert('Shares purchased!');
      fetchAllMarkets();
    } catch (err) {
      console.error('Buy error:', err);
      setAlert('Failed to buy shares');
    }
  };

  const sellShares = async (marketId: number, option: number) => {
    try {
      if (!contract) throw new Error('No contract connected');
      const amount = prompt('Enter number of shares to sell:');
      if (!amount || isNaN(Number(amount))) return;

      const parsed = ethers.parseUnits(amount, 6);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractWithSigner = contract.connect(signer);
      const tx = await contractWithSigner.sellShares(marketId, option, parsed);
      await tx.wait();

      setAlert('Shares sold!');
      fetchAllMarkets();
    } catch (err) {
      console.error('Sell error:', err);
      setAlert('Failed to sell shares');
    }
  };

  const claimWinnings = async (marketId: number) => {
    try {
      if (!contract) throw new Error('No contract instance');
      const tx = await contract.claimWinnings(marketId);
      await tx.wait();
      setAlert('Winnings claimed!');
      fetchAllMarkets();
    } catch (err) {
      console.error(err);
      setAlert('Claim failed');
    }
  };

  const closeMarket = async (marketId: number, result: number) => {
    try {
      if (!contract) throw new Error('No contract instance');
      const tx = await contract.closeMarket(marketId, result);
      await tx.wait();
      setAlert('Market closed!');
      fetchAllMarkets();
    } catch (err) {
      console.error(err);
      setAlert('Failed to close market');
    }
  };

  const fetchAllMarkets = useCallback(async () => {
    if (!contract) return;
    try {
      const total = await contract.marketCounter();
      const all = [];

      for (let i = 0; i < total; i++) {
        const [totalLiquidity, yesPool, noPool] = await contract.getLiquidity(
          i
        );
        const [yesShares, noShares] = await contract.getUserShares(i, account);
        const yesPrice = await contract.getCurrentPrice(i, 0);
        const noPrice = await contract.getCurrentPrice(i, 1);
        const m = await contract.markets(i);

        all.push({
          id: i,
          question: m.question,
          isOpen: m.isOpen,
          resultDeclared: m.resultDeclared,
          finalResult: m.finalResult,
          yesShares: ethers.formatUnits(yesShares, 6),
          noShares: ethers.formatUnits(noShares, 6),
          liquidity: ethers.formatUnits(totalLiquidity, 6),
          yesPrice: ethers.formatUnits(yesPrice, 6),
          noPrice: ethers.formatUnits(noPrice, 6),
        });
      }

      setMarkets(all);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  }, [contract, account]);

  useEffect(() => {
    if (contract) fetchAllMarkets();
  }, [contract, fetchAllMarkets]);

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant='h4'>Prediction Market</Typography>

      {!walletConnected && (
        <>
          <Button variant='contained' onClick={connectWallet}>
            Connect Wallet
          </Button>
          <Typography variant='body2' color='warning.main' sx={{ mt: 2 }}>
            Note: The network should be <b>Sepolia ETH</b>
          </Typography>
        </>
      )}

      {walletConnected && (
        <Box my={3}>
          <TextField
            label='Market Question'
            fullWidth
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label='Initial Liquidity (USDC)'
            fullWidth
            value={liquidity}
            onChange={(e) => setLiquidity(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button variant='contained' onClick={createMarket}>
            Create Market
          </Button>
        </Box>
      )}

      <Grid container spacing={2}>
        {markets.map((market) => (
          <Grid size={{ xs: 12, md: 6 }} key={market.id}>
            <Box border={1} borderRadius={2} p={2}>
              <Typography variant='h6'>
                #{market.id} - {market.question}
              </Typography>
              <Typography variant='body2'>
                Total Liquidity: {market.liquidity} USDC
              </Typography>
              <Typography variant='body2'>
                Current Price - YES: {market.yesPrice} USDC
              </Typography>
              <Typography variant='body2'>
                Current Price - NO: {market.noPrice} USDC
              </Typography>
              <Typography variant='body2'>
                Your YES Shares: {market.yesShares}
              </Typography>
              <Typography variant='body2'>
                Your NO Shares: {market.noShares}
              </Typography>

              <Stack direction='row' spacing={2} mt={2}>
                <Button
                  variant='outlined'
                  onClick={() => buyShares(market.id, 0)}
                  disabled={!market.isOpen}
                >
                  Buy YES
                </Button>
                <Button
                  variant='outlined'
                  onClick={() => buyShares(market.id, 1)}
                  disabled={!market.isOpen}
                >
                  Buy NO
                </Button>
                <Button
                  variant='outlined'
                  onClick={() => sellShares(market.id, 0)}
                  disabled={!market.isOpen}
                >
                  Sell YES
                </Button>
                <Button
                  variant='outlined'
                  onClick={() => sellShares(market.id, 1)}
                  disabled={!market.isOpen}
                >
                  Sell NO
                </Button>
              </Stack>

              {market.resultDeclared && (
                <Button
                  variant='contained'
                  color='info'
                  onClick={() => claimWinnings(market.id)}
                  sx={{ mt: 2 }}
                >
                  Claim Winnings
                </Button>
              )}

              {account.toLowerCase() === admin.toLowerCase() &&
                market.isOpen && (
                  <Stack direction='row' spacing={2} mt={2}>
                    <Button
                      variant='contained'
                      color='success'
                      onClick={() => closeMarket(market.id, 0)}
                    >
                      Resolve YES
                    </Button>
                    <Button
                      variant='contained'
                      color='error'
                      onClick={() => closeMarket(market.id, 1)}
                    >
                      Resolve NO
                    </Button>
                  </Stack>
                )}
            </Box>
          </Grid>
        ))}
      </Grid>

      {alert && (
        <Alert severity='info' sx={{ mt: 3 }}>
          {alert}
        </Alert>
      )}
    </Container>
  );
}
