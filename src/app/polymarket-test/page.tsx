'use client';

import { useCallback, useEffect, useState } from 'react';
import { Contract, ethers } from 'ethers';
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
import { getPolyMarketContract1 } from '@/lib/contract';
import { usdcABI, usdcAddress } from '@/lib/usdc';

export default function Page() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [account, setAccount] = useState('');
  const [admin, setAdmin] = useState('');
  const [question, setQuestion] = useState('');
  const [liquidity, setLiquidity] = useState('');
  const [totalLiquidity, setTotalLiquidity] = useState('0');
  const [sharePrice, setSharePrice] = useState('');
  const [contract, setContract] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState('');
  const [markets, setMarkets] = useState<any[]>([]);

  console.log('Contract:', contract);
  console.log('Account:', account);
  console.log('Wallet Connected:', walletConnected);
  console.log('Question:', question);
  console.log('Liquidity:', liquidity);
  console.log('Total Liquidity:', totalLiquidity);
  console.log('Share Price:', sharePrice);
  console.log('Is Loading:', isLoading);
  console.log('Markets:', markets);
  console.log('Admin:', admin);

  const connectWallet = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const c = getPolyMarketContract1(signer);
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
      const priceAmount = ethers.parseUnits(sharePrice, 6);

      const userAddress = await signer.getAddress();
      const contractAddress = await contract.getAddress();
      const balance = await usdc.balanceOf(userAddress);
      const allowance = await usdc.allowance(userAddress, contractAddress);
      console.log('User address:', userAddress);
      console.log('Contract address:', contractAddress);
      console.log('USDC Balance:', balance.toString());
      console.log('USDC Allowance:', allowance.toString());
      console.log('Liquidity needed:', liquidityAmount.toString());

      if (balance < liquidityAmount) {
        throw new Error('Insufficient USDC balance');
      }

      if (allowance < liquidityAmount) {
        const approval = await usdc.approve(contractAddress, liquidityAmount);
        await approval.wait();
      }

      const tx = await contract.createMarket(
        question,
        liquidityAmount,
        priceAmount
      );
      await tx.wait();

      setAlert('Market created!');
      setQuestion('');
      console.log('USDC Balance:', balance.toString());
      console.log('USDC Allowance:', allowance.toString());
      console.log('Liquidity needed:', liquidityAmount.toString());
      fetchAllMarkets();
    } catch (err) {
      console.error(err);
      setAlert('Transaction failed');
    }
  };
  console.log('Contract:', contract);
  const buyShares = async (marketId: number, option: number) => {
    try {
      if (!contract) throw new Error('No contract connected');
      const shares = prompt('Enter number of shares to buy:');
      if (!shares || isNaN(Number(shares))) return;

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const c = contract.connect(signer);
      console.log('C', c);

      const tx = await c.buyShares(marketId, option, shares);
      await tx.wait();

      setAlert('Shares purchased!');
      fetchAllMarkets();
    } catch (err) {
      console.error('Buy error:', err);
      setAlert('Failed to buy shares');
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
      let sum = 0;
      console.log('Sum:', sum);
      for (let i = 0; i < total; i++) {
        const m = await contract.markets(i);
        const liq = parseFloat(ethers.formatUnits(m.liquidity, 6));
        all.push({
          id: i,
          question: m.question,
          isOpen: m.isOpen,
          resultDeclared: m.resultDeclared,
          finalResult: m.finalResult,
          yesShares: m.totalYesShares,
          noShares: m.totalNoShares,
          liquidity: liq.toFixed(2),
        });
        sum += liq;
      }

      setMarkets(all);
      setTotalLiquidity(sum.toFixed(2));
    } catch (err) {
      console.error('Fetch error:', err);
    }
  }, [contract]);

  useEffect(() => {
    if (contract) fetchAllMarkets();
  }, [contract, fetchAllMarkets]);

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant='h4'>Prediction Market</Typography>

      {!walletConnected && (
        <Button variant='contained' onClick={connectWallet}>
          Connect Wallet
        </Button>
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
          <TextField
            label='Initial Share Price (0-1 USDC)'
            fullWidth
            value={sharePrice}
            onChange={(e) => setSharePrice(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button variant='contained' onClick={createMarket}>
            Create Market
          </Button>
        </Box>
      )}

      <Grid container spacing={2}>
        {markets.map((market) => (
          <>
            {console.log('Market============', market)}
            <Grid size={{ xs: 12, md: 6 }} key={market.id}>
              <Box border={1} borderRadius={2} p={2}>
                <Typography variant='h6'>
                  #{market.id} - {market.question}
                </Typography>
                <Typography variant='body2'>
                  Liquidity: {market.liquidity} USDC
                </Typography>
                <Typography variant='subtitle1' sx={{ mb: 2 }}>
                  Total Liquidity Across All Markets: {totalLiquidity} USDC
                </Typography>
                <Typography variant='body2'>
                  YES Shares: {market.yesShares.toString()}
                </Typography>
                <Typography variant='body2'>
                  NO Shares: {market.noShares.toString()}
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
                </Stack>

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
          </>
        ))}
      </Grid>

      {alert && <Alert sx={{ mt: 3 }}>{alert}</Alert>}
    </Container>
  );
}
