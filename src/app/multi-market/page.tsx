'use client';

import { useCallback, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import {
  Container,
  Typography,
  Button,
  Box,
  TextField,
  Stack,
  Alert,
} from '@mui/material';
import { getMultiMarketContract } from '@/lib/contract';

export default function Page() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [account, setAccount] = useState('');
  const [admin, setAdmin] = useState('');
  const [question, setQuestion] = useState('');
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState('');
  const [markets, setMarkets] = useState<any[]>([]);

  console.log('Contract:', contract);
  console.log('Account:', account);
  console.log('Wallet Connected:', walletConnected);
  console.log('Question:', question);
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
      const c = getMultiMarketContract(signer);
      const adminAddr = await c.admin();

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
      const tx = await contract.createMarket(question);
      await tx.wait();
      setAlert('Market created!');
      setQuestion('');
      fetchAllMarkets();
    } catch (err) {
      console.error(err);
      setAlert('Transaction failed');
    }
  };

  const vote = async (marketId: number, option: number) => {
    try {
      if (!contract) throw new Error('No contract instance');
      const tx = await contract.vote(marketId, option, {
        value: ethers.parseEther('0.001'),
      });
      await tx.wait();
      setAlert('Vote submitted!');
      fetchAllMarkets();
    } catch (err) {
      console.error(err);
      setAlert('Voting failed');
    }
  };

  const closeMarket = async (marketId: number, result: number) => {
    try {
      if (!contract) throw new Error('No contract instance');
      const tx = await contract.closeMarketAndSettle(marketId, result);
      await tx.wait();
      setAlert('Market closed and rewards distributed!');
      fetchAllMarkets();
    } catch (err) {
      console.error(err);
      setAlert('Failed to close market');
    }
  };

  const fetchAllMarkets = useCallback(async () => {
    if (!contract) return;
    try {
      const total = await contract.getAllMarketsCount();
      const all = [];

      for (let i = 0; i < total; i++) {
        const data = await contract.getMarket(i);
        const [yesVoters, noVoters] = await Promise.all([
          contract.getYesVoters(i),
          contract.getNoVoters(i),
        ]);
        const [yesAmountWei, noAmountWei] = await contract.getCollectedAmounts(
          i
        );

        all.push({
          id: i,
          question: data[0],
          isOpen: data[1],
          resultDeclared: data[2],
          finalResult: data[3],
          yesCount: yesVoters.length,
          noCount: noVoters.length,
          yesAmount: ethers.formatEther(yesAmountWei),
          noAmount: ethers.formatEther(noAmountWei),
        });
      }

      setMarkets(all);
    } catch (err) {
      console.error('Failed to fetch all markets:', err);
    }
  }, [contract]);

  useEffect(() => {
    const getAdmin = async () => {
      if (!contract) return;
      try {
        const adminAddress = await contract.admin();
        setAdmin(adminAddress);
      } catch (err) {
        console.error('Failed to fetch admin:', err);
      }
    };

    getAdmin();
  }, [contract]);

  useEffect(() => {
    if (contract) {
      fetchAllMarkets();
    }
  }, [contract, fetchAllMarkets]);

  return (
    <Container maxWidth='sm' sx={{ mt: 5 }}>
      <Typography variant='h4' gutterBottom>
        Decentralized Prediction Market
      </Typography>

      {account ? (
        <Typography variant='subtitle1' sx={{ mb: 2 }}>
          Connected: {account}
        </Typography>
      ) : (
        <Button variant='contained' onClick={connectWallet}>
          Connect Wallet
        </Button>
      )}

      <Box my={3}>
        <TextField
          label='Enter Market Question'
          variant='outlined'
          fullWidth
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <Button
          sx={{ mt: 2 }}
          variant='contained'
          onClick={createMarket}
          disabled={isLoading}
        >
          Create Market
        </Button>
      </Box>

      {markets.map((market) => (
        <Box key={market.id} border={1} borderRadius={2} p={2} mb={3}>
          <Typography variant='h6' color='primary'>
            Market #{market.id}
          </Typography>
          <Typography variant='body1' fontWeight='bold'>
            {market.question}
          </Typography>

          <Stack direction='row' spacing={2} mt={2}>
            <Button
              variant='outlined'
              color='success'
              onClick={() => vote(market.id, 0)}
              disabled={!market.isOpen}
            >
              Vote YES ({market.yesCount})
            </Button>
            <Button
              variant='outlined'
              color='error'
              onClick={() => vote(market.id, 1)}
              disabled={!market.isOpen}
            >
              Vote NO ({market.noCount})
            </Button>
          </Stack>

          <Box mt={1}>
            <Typography variant='body2'>
              Yes Pool: {market.yesAmount} ETH
            </Typography>
            <Typography variant='body2'>
              No Pool: {market.noAmount} ETH
            </Typography>
          </Box>

          {!market.isOpen && (
            <Box mt={2}>
              <Alert severity='warning'>Market has been closed</Alert>
            </Box>
          )}

          {account.toLowerCase() === admin.toLowerCase() && market.isOpen && (
            <Stack direction='row' spacing={2} mt={2}>
              <Button
                variant='contained'
                color='success'
                onClick={() => closeMarket(market.id, 0)}
              >
                Resolve: YES
              </Button>
              <Button
                variant='contained'
                color='error'
                onClick={() => closeMarket(market.id, 1)}
              >
                Resolve: NO
              </Button>
            </Stack>
          )}
        </Box>
      ))}

      {alert && (
        <Alert severity='info' sx={{ mt: 3 }}>
          {alert}
        </Alert>
      )}
    </Container>
  );
}
