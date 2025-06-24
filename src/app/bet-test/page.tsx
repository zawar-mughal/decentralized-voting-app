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
import { getContract } from '@/lib/contract';

export default function Page() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [account, setAccount] = useState('');
  const [question, setQuestion] = useState('');
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [alert, setAlert] = useState<string>('');
  const [yesCount, setYesCount] = useState<number>(0);
  const [noCount, setNoCount] = useState<number>(0);
  const [marketQuestion, setMarketQuestion] = useState<string>('');

  console.log('Contract:', contract);
  console.log('Account:', account);
  console.log('Wallet Connected:', walletConnected);
  console.log('Question:', question);
  console.log('Is Loading:', isLoading);
  console.log('Market Question:', marketQuestion);
  // const connectWallet = async () => {
  //   try {
  //     const provider = new ethers.BrowserProvider(window.ethereum);
  //     const signer = await provider.getSigner();
  //     const addr = await signer.getAddress();
  //     setAccount(addr);
  //     // setContract(getContract(signer));
  //   } catch (err) {
  //     console.error(err);
  //     setAlert('Failed to connect wallet');
  //   }
  // };

  const connectWallet = async () => {
    try {
      // Request account access from MetaMask
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      // Log the connected account to the console
      console.log('Connected account:', accounts[0]);
      setAccount(accounts[0]);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      setContract(getContract(signer));
      setWalletConnected(true);

      // You can use the connected account further in your application as needed
    } catch (error) {
      // Handle error if user denies account access or there's another issue
      console.error('Error connecting to MetaMask:', error);
    }
  };

  async function createMarket() {
    try {
      if (!contract) {
        throw new Error(
          'Contract instance is not available. Please connect your wallet.'
        );
      }
      const tx = await contract.createMarket(question);
      await tx.wait();
      setAlert('Market created!');
    } catch (err) {
      console.error(err);
      setAlert('Transaction failed');
    }
  }

  async function vote(option: any) {
    try {
      if (!contract) {
        throw new Error('Contract instance is not available for Voteing.');
      }
      const tx = await contract.vote(option, {
        value: ethers.parseEther('0.001'),
      });
      await tx.wait();
      setAlert('Vote submitted!');
    } catch (err) {
      console.error(err);
    }
  }

  const fetchVoteCounts = useCallback(async () => {
    if (!contract) return;
    try {
      const yesVoters: string[] = await contract.getYesVoters();
      const noVoters: string[] = await contract.getNoVoters();
      setYesCount(yesVoters.length);
      setNoCount(noVoters.length);
    } catch (err) {
      console.error('Failed to fetch voters:', err);
    }
  }, [contract]);

  async function closeMarket(result: any) {
    try {
      if (!contract) {
        throw new Error('Contract instance is not available.');
      }
      const tx = await contract.closeMarketAndSettle(result);
      await tx.wait();
      setAlert('Market closed and rewards distributed!');
    } catch (err) {
      console.error(err);
    }
  }

  const fetchMarketQuestion = useCallback(async () => {
    if (!contract) return;

    try {
      const q: string = await contract.question();
      setMarketQuestion(q);
    } catch (err) {
      console.error('Failed to fetch market question:', err);
    }
  }, [contract]);

  useEffect(() => {
    if (contract) {
      fetchMarketQuestion();
      fetchVoteCounts();
    }
  }, [contract, fetchMarketQuestion, fetchVoteCounts]);

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

      {marketQuestion && (
        <Box my={2}>
          <Typography variant='h6' color='primary'>
            Current Market Question
          </Typography>
          <Typography variant='body1' fontWeight='bold'>
            {marketQuestion}
          </Typography>
        </Box>
      )}

      <Stack spacing={2} direction='row' justifyContent='center'>
        <Box textAlign='center'>
          <Button
            variant='outlined'
            color='success'
            onClick={() => vote(0)}
            disabled={isLoading}
          >
            Vote YES
          </Button>
          <Typography variant='caption' display='block'>
            Yes Votes: {yesCount}
          </Typography>
        </Box>
        <Box textAlign='center'>
          <Button
            variant='outlined'
            color='error'
            onClick={() => vote(1)}
            disabled={isLoading}
          >
            Vote NO
          </Button>
          <Typography variant='caption' display='block'>
            No Votes: {noCount}
          </Typography>
        </Box>
      </Stack>

      <Box mt={4}>
        <Typography variant='h6'>Admin Controls</Typography>
        <Stack spacing={2} direction='row' mt={1}>
          <Button
            variant='contained'
            color='success'
            onClick={() => closeMarket(0)}
            disabled={isLoading}
          >
            Resolve: YES
          </Button>
          <Button
            variant='contained'
            color='error'
            onClick={() => closeMarket(1)}
            disabled={isLoading}
          >
            Resolve: NO
          </Button>
        </Stack>
      </Box>

      {alert && (
        <Alert severity='info' sx={{ mt: 3 }}>
          {alert}
        </Alert>
      )}
    </Container>
  );
}
