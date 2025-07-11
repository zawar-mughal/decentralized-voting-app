import { ethers } from 'ethers';

const CONTRACT_ADDRESS = '0x97744e79d9BA23e96324215665FD713C753b2678';
const CONTRACT_ABI = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'admin',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'enum PredictionMarket.Option',
        name: '_result',
        type: 'uint8',
      },
    ],
    name: 'closeMarketAndSettle',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '_question',
        type: 'string',
      },
    ],
    name: 'createMarket',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'finalResult',
    outputs: [
      {
        internalType: 'enum PredictionMarket.Option',
        name: '',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getMarketDetails',
    outputs: [
      {
        internalType: 'string',
        name: '_question',
        type: 'string',
      },
      {
        internalType: 'bool',
        name: '_isOpen',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: '_resultDeclared',
        type: 'bool',
      },
      {
        internalType: 'uint256',
        name: '_yesCount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_noCount',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getNoVoters',
    outputs: [
      {
        internalType: 'address[]',
        name: '',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getYesVoters',
    outputs: [
      {
        internalType: 'address[]',
        name: '',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'isMarketOpen',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'noVoters',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'question',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'resultDeclared',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalNoVotes',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalYesVotes',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'enum PredictionMarket.Option',
        name: '_option',
        type: 'uint8',
      },
    ],
    name: 'vote',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'voteAmount',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'voters',
    outputs: [
      {
        internalType: 'bool',
        name: 'voted',
        type: 'bool',
      },
      {
        internalType: 'enum PredictionMarket.Option',
        name: 'choice',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'yesVoters',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

// Contract for Create Single market and Vote on it at a time

// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.20;

// contract PredictionMarket {
//     address public admin;
//     string public question;
//     bool public isMarketOpen;
//     bool public resultDeclared;

//     enum Option { Yes, No }

//     struct Voter {
//         bool voted;
//         Option choice;
//     }

//     mapping(address => Voter) public voters;
//     address[] public yesVoters;
//     address[] public noVoters;

//     uint256 public totalYesVotes;
//     uint256 public totalNoVotes;
//     Option public finalResult;

//     uint256 public voteAmount = 0.001 ether;

//     constructor() {
//         admin = msg.sender;
//     }

//     modifier onlyAdmin() {
//         require(msg.sender == admin, "Only admin can perform this action.");
//         _;
//     }

//     modifier marketOpen() {
//         require(isMarketOpen, "Market is not open.");
//         _;
//     }

//     function createMarket(string calldata _question) external onlyAdmin {
//         require(!isMarketOpen, "Previous market is still open.");
//         question = _question;
//         isMarketOpen = true;
//         resultDeclared = false;

//         // Reset vote state
//         for (uint256 i = 0; i < yesVoters.length; i++) {
//             delete voters[yesVoters[i]];
//         }
//         for (uint256 i = 0; i < noVoters.length; i++) {
//             delete voters[noVoters[i]];
//         }

//         delete yesVoters;
//         delete noVoters;
//         totalYesVotes = 0;
//         totalNoVotes = 0;
//     }

//     function vote(Option _option) external payable marketOpen {
//         require(msg.value == voteAmount, "Must send exactly 0.001 ETH");
//         require(!voters[msg.sender].voted, "You have already voted");

//         voters[msg.sender] = Voter({
//             voted: true,
//             choice: _option
//         });

//         if (_option == Option.Yes) {
//             yesVoters.push(msg.sender);
//             totalYesVotes++;
//         } else {
//             noVoters.push(msg.sender);
//             totalNoVotes++;
//         }
//     }

//     function closeMarketAndSettle(Option _result) external onlyAdmin {
//         require(isMarketOpen, "Market already closed");
//         isMarketOpen = false;
//         resultDeclared = true;
//         finalResult = _result;

//         address[] memory winners = (_result == Option.Yes) ? yesVoters : noVoters;
//         address[] memory losers = (_result == Option.Yes) ? noVoters : yesVoters;
//         uint256 rewardPool = losers.length * voteAmount;

//         if (winners.length > 0 && rewardPool > 0) {
//             uint256 rewardPerWinner = rewardPool / winners.length;
//             for (uint256 i = 0; i < winners.length; i++) {
//                 payable(winners[i]).transfer(voteAmount + rewardPerWinner);
//             }
//         }
//     }

//     // View functions to get voter addresses
//     function getYesVoters() external view returns (address[] memory) {
//         return yesVoters;
//     }

//     function getNoVoters() external view returns (address[] memory) {
//         return noVoters;
//     }

//     // Market metadata
//     function getMarketDetails() external view returns (
//         string memory _question,
//         bool _isOpen,
//         bool _resultDeclared,
//         uint256 _yesCount,
//         uint256 _noCount
//     ) {
//         return (question, isMarketOpen, resultDeclared, totalYesVotes, totalNoVotes);
//     }
// }

export function getContract(signerOrProvider: any) {
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signerOrProvider);
}

const MULTI_MARKET_CONTRACT_ADDRESS =
  '0xEf37d05A7860f5F495BdE2796f13fA78A68dDb8C';
const MULTI_MARKET_CONTRACT_ABI = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'admin',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'marketId',
        type: 'uint256',
      },
      {
        internalType: 'enum PredictionMarketV2.Option',
        name: '_result',
        type: 'uint8',
      },
    ],
    name: 'closeMarketAndSettle',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '_question',
        type: 'string',
      },
    ],
    name: 'createMarket',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getAllMarketsCount',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'marketId',
        type: 'uint256',
      },
    ],
    name: 'getCollectedAmounts',
    outputs: [
      {
        internalType: 'uint256',
        name: 'yesAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'noAmount',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'marketId',
        type: 'uint256',
      },
    ],
    name: 'getMarket',
    outputs: [
      {
        internalType: 'string',
        name: 'question',
        type: 'string',
      },
      {
        internalType: 'bool',
        name: 'isOpen',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: 'resultDeclared',
        type: 'bool',
      },
      {
        internalType: 'enum PredictionMarketV2.Option',
        name: 'result',
        type: 'uint8',
      },
      {
        internalType: 'uint256',
        name: 'yesCount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'noCount',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'marketId',
        type: 'uint256',
      },
    ],
    name: 'getNoVoters',
    outputs: [
      {
        internalType: 'address[]',
        name: '',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'marketId',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'getVoter',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
      {
        internalType: 'enum PredictionMarketV2.Option',
        name: '',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'marketId',
        type: 'uint256',
      },
    ],
    name: 'getYesVoters',
    outputs: [
      {
        internalType: 'address[]',
        name: '',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'marketCounter',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'marketId',
        type: 'uint256',
      },
      {
        internalType: 'enum PredictionMarketV2.Option',
        name: '_option',
        type: 'uint8',
      },
    ],
    name: 'vote',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'voteAmount',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

// Contract for Create Multiple markets and Vote on it at a time
// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.20;

// contract PredictionMarketV2 {
//     address public admin;
//     uint256 public voteAmount = 0.001 ether;
//     uint256 public marketCounter;

//     enum Option { Yes, No }

//     struct Voter {
//         bool voted;
//         Option choice;
//     }

//     struct Market {
//         string question;
//         bool isOpen;
//         bool resultDeclared;
//         Option finalResult;

//         uint256 totalYesVotes;
//         uint256 totalNoVotes;

//         address[] yesVoters;
//         address[] noVoters;

//         mapping(address => Voter) voters;
//     }

//     mapping(uint256 => Market) private markets;

//     constructor() {
//         admin = msg.sender;
//     }

//     modifier onlyAdmin() {
//         require(msg.sender == admin, "Only admin can perform this action");
//         _;
//     }

//     modifier marketExists(uint256 marketId) {
//         require(marketId < marketCounter, "Market does not exist");
//         _;
//     }

//     function createMarket(string calldata _question) external onlyAdmin {
//         Market storage m = markets[marketCounter];
//         m.question = _question;
//         m.isOpen = true;
//         m.resultDeclared = false;
//         marketCounter++;
//     }

//     function vote(uint256 marketId, Option _option) external payable marketExists(marketId) {
//         Market storage m = markets[marketId];
//         require(m.isOpen, "Market is closed");
//         require(!m.voters[msg.sender].voted, "Already voted");
//         require(msg.value == voteAmount, "Must send exactly 0.001 ETH");

//         m.voters[msg.sender] = Voter({
//             voted: true,
//             choice: _option
//         });

//         if (_option == Option.Yes) {
//             m.yesVoters.push(msg.sender);
//             m.totalYesVotes++;
//         } else {
//             m.noVoters.push(msg.sender);
//             m.totalNoVotes++;
//         }
//     }

//     function closeMarketAndSettle(uint256 marketId, Option _result) external onlyAdmin marketExists(marketId) {
//         Market storage m = markets[marketId];
//         require(m.isOpen, "Market already closed");

//         m.isOpen = false;
//         m.resultDeclared = true;
//         m.finalResult = _result;

//         address[] memory winners = (_result == Option.Yes) ? m.yesVoters : m.noVoters;
//         address[] memory losers = (_result == Option.Yes) ? m.noVoters : m.yesVoters;
//         uint256 rewardPool = losers.length * voteAmount;

//         if (winners.length > 0 && rewardPool > 0) {
//             uint256 rewardPerWinner = rewardPool / winners.length;
//             for (uint256 i = 0; i < winners.length; i++) {
//                 payable(winners[i]).transfer(voteAmount + rewardPerWinner);
//             }
//         }
//     }

//     // 🔎 Public View Functions

//     function getMarket(uint256 marketId) external view marketExists(marketId)
//         returns (
//             string memory question,
//             bool isOpen,
//             bool resultDeclared,
//             Option result,
//             uint256 yesCount,
//             uint256 noCount
//         )
//     {
//         Market storage m = markets[marketId];
//         return (
//             m.question,
//             m.isOpen,
//             m.resultDeclared,
//             m.finalResult,
//             m.totalYesVotes,
//             m.totalNoVotes
//         );
//     }

//     function getYesVoters(uint256 marketId) external view marketExists(marketId) returns (address[] memory) {
//         return markets[marketId].yesVoters;
//     }

//     function getNoVoters(uint256 marketId) external view marketExists(marketId) returns (address[] memory) {
//         return markets[marketId].noVoters;
//     }

//     function getVoter(uint256 marketId, address user) external view marketExists(marketId) returns (bool, Option) {
//         Voter storage v = markets[marketId].voters[user];
//         return (v.voted, v.choice);
//     }

//     function getAllMarketsCount() external view returns (uint256) {
//         return marketCounter;
//     }
//     function getCollectedAmounts(uint256 marketId) external view returns (uint256 yesAmount, uint256 noAmount) {
//       Market storage m = markets[marketId];
//       yesAmount = m.totalYesVotes * voteAmount;
//       noAmount = m.totalNoVotes * voteAmount;
//   }
// }

export function getMultiMarketContract(signerOrProvider: any) {
  return new ethers.Contract(
    MULTI_MARKET_CONTRACT_ADDRESS,
    MULTI_MARKET_CONTRACT_ABI,
    signerOrProvider
  );
}

const POLYMARKET_CONTRACT_1_ADDRESS =
  '0x35Ba874e7Ee163c3f7d1278bA16cf5e1c333cFca';
const POLYMARKET_CONTRACT_1_ABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_usdc',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'OwnableInvalidOwner',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'OwnableUnauthorizedAccount',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'enum PolymarketStylePrediction.Option',
        name: 'result',
        type: 'uint8',
      },
    ],
    name: 'MarketClosed',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'question',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'initialPrice',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'liquidity',
        type: 'uint256',
      },
    ],
    name: 'MarketCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'enum PolymarketStylePrediction.Option',
        name: 'option',
        type: 'uint8',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'shares',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'cost',
        type: 'uint256',
      },
    ],
    name: 'SharePurchased',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'payout',
        type: 'uint256',
      },
    ],
    name: 'WinningsClaimed',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'marketId',
        type: 'uint256',
      },
      {
        internalType: 'enum PolymarketStylePrediction.Option',
        name: '_option',
        type: 'uint8',
      },
      {
        internalType: 'uint256',
        name: 'shareAmount',
        type: 'uint256',
      },
    ],
    name: 'buyShares',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'marketId',
        type: 'uint256',
      },
    ],
    name: 'claimWinnings',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'marketId',
        type: 'uint256',
      },
      {
        internalType: 'enum PolymarketStylePrediction.Option',
        name: 'result',
        type: 'uint8',
      },
    ],
    name: 'closeMarket',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '_question',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: '_initialLiquidity',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_initialSharePrice',
        type: 'uint256',
      },
    ],
    name: 'createMarket',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'marketId',
        type: 'uint256',
      },
      {
        internalType: 'enum PolymarketStylePrediction.Option',
        name: 'option',
        type: 'uint8',
      },
    ],
    name: 'getCurrentPrice',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'marketCounter',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'markets',
    outputs: [
      {
        internalType: 'string',
        name: 'question',
        type: 'string',
      },
      {
        internalType: 'bool',
        name: 'isOpen',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: 'resultDeclared',
        type: 'bool',
      },
      {
        internalType: 'enum PolymarketStylePrediction.Option',
        name: 'finalResult',
        type: 'uint8',
      },
      {
        internalType: 'uint256',
        name: 'totalYesShares',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'totalNoShares',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'liquidity',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'initialSharePrice',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'usdc',
    outputs: [
      {
        internalType: 'contract IERC20',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.20;

// import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";

// contract PolymarketStylePrediction is Ownable {
//     IERC20 public usdc;
//     uint256 public marketCounter;

//     enum Option { Yes, No }

//     struct Market {
//         string question;
//         bool isOpen;
//         bool resultDeclared;
//         Option finalResult;

//         uint256 totalYesShares;
//         uint256 totalNoShares;
//         uint256 liquidity; // total USDC liquidity

//         mapping(address => uint256) yesShares;
//         mapping(address => uint256) noShares;

//         mapping(address => bool) hasClaimed;
//         uint256 initialSharePrice; // in USDC, with 6 decimals
//     }

//     mapping(uint256 => Market) public markets;

//     event MarketCreated(uint256 indexed id, string question, uint256 initialPrice, uint256 liquidity);
//     event SharePurchased(uint256 indexed id, address indexed user, Option option, uint256 shares, uint256 cost);
//     event MarketClosed(uint256 indexed id, Option result);
//     event WinningsClaimed(uint256 indexed id, address indexed user, uint256 payout);

//     constructor(address _usdc) Ownable(msg.sender){
//         usdc = IERC20(_usdc);
//     }

//     modifier marketExists(uint256 marketId) {
//         require(marketId < marketCounter, "Invalid market");
//         _;
//     }

//     function createMarket(
//         string calldata _question,
//         uint256 _initialLiquidity,
//         uint256 _initialSharePrice // e.g. 0.50 USDC = 500000
//     ) external {
//         require(_initialLiquidity > 0, "Liquidity must be > 0");
//         require(_initialSharePrice > 0 && _initialSharePrice < 1e6, "Price must be between 0 and 1 USDC");

//         uint256 totalCost = _initialLiquidity;
//         require(usdc.transferFrom(msg.sender, address(this), totalCost), "USDC transfer failed");

//         Market storage m = markets[marketCounter];
//         m.question = _question;
//         m.isOpen = true;
//         m.liquidity = _initialLiquidity;
//         m.initialSharePrice = _initialSharePrice;

//         marketCounter++;
//         emit MarketCreated(marketCounter - 1, _question, _initialSharePrice, _initialLiquidity);
//     }

//     function buyShares(uint256 marketId, Option _option, uint256 shareAmount) external marketExists(marketId) {
//         Market storage m = markets[marketId];
//         require(m.isOpen, "Market closed");
//         require(shareAmount > 0, "Must buy > 0");

//         // price moves linearly for simplicity (replace with CPMM for production)
//         uint256 costPerShare = getCurrentPrice(marketId, _option);
//         uint256 totalCost = costPerShare * shareAmount / 1e6;

//         require(usdc.transferFrom(msg.sender, address(this), totalCost), "USDC payment failed");

//         if (_option == Option.Yes) {
//             m.yesShares[msg.sender] += shareAmount;
//             m.totalYesShares += shareAmount;
//         } else {
//             m.noShares[msg.sender] += shareAmount;
//             m.totalNoShares += shareAmount;
//         }

//         m.liquidity += totalCost;
//         emit SharePurchased(marketId, msg.sender, _option, shareAmount, totalCost);
//     }

//     function getCurrentPrice(uint256 marketId, Option option) public view marketExists(marketId) returns (uint256) {
//         Market storage m = markets[marketId];
//         uint256 yes = m.totalYesShares + 1; // avoid divide by 0
//         uint256 no = m.totalNoShares + 1;
//         if (option == Option.Yes) {
//             return (m.initialSharePrice * no) / (yes + no);
//         } else {
//             return (m.initialSharePrice * yes) / (yes + no);
//         }
//     }

//     function closeMarket(uint256 marketId, Option result) external onlyOwner marketExists(marketId) {
//         Market storage m = markets[marketId];
//         require(m.isOpen, "Already closed");

//         m.isOpen = false;
//         m.resultDeclared = true;
//         m.finalResult = result;

//         emit MarketClosed(marketId, result);
//     }

//     function claimWinnings(uint256 marketId) external marketExists(marketId) {
//         Market storage m = markets[marketId];
//         require(m.resultDeclared, "Not resolved");
//         require(!m.hasClaimed[msg.sender], "Already claimed");

//         uint256 payout;
//         if (m.finalResult == Option.Yes) {
//             payout = m.yesShares[msg.sender];
//         } else {
//             payout = m.noShares[msg.sender];
//         }
//         require(payout > 0, "No winning shares");

//         uint256 totalWinningShares = (m.finalResult == Option.Yes) ? m.totalYesShares : m.totalNoShares;
//         uint256 shareValue = (m.liquidity * payout) / totalWinningShares;

//         m.hasClaimed[msg.sender] = true;
//         require(usdc.transfer(msg.sender, shareValue), "Payout failed");

//         emit WinningsClaimed(marketId, msg.sender, shareValue);
//     }
// }

export function getPolyMarketContract1(signer: any) {
  return new ethers.Contract(
    POLYMARKET_CONTRACT_1_ADDRESS,
    POLYMARKET_CONTRACT_1_ABI,
    signer
  );
}

const POLYMARKET_CONTRACT_2_ADDRESS =
  '0xbbB3318D9458DEEb3355d3159C044d2312eE317D';
const POLYMARKET_CONTRACT_2_ABI = [
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'marketId',
        type: 'uint256',
      },
      {
        internalType: 'enum AMMPolymarket.Option',
        name: '_option',
        type: 'uint8',
      },
      {
        internalType: 'uint256',
        name: 'usdcAmount',
        type: 'uint256',
      },
    ],
    name: 'buyShares',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'marketId',
        type: 'uint256',
      },
    ],
    name: 'claimWinnings',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'marketId',
        type: 'uint256',
      },
      {
        internalType: 'enum AMMPolymarket.Option',
        name: 'result',
        type: 'uint8',
      },
    ],
    name: 'closeMarket',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '_question',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: '_initialLiquidity',
        type: 'uint256',
      },
    ],
    name: 'createMarket',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_usdc',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'OwnableInvalidOwner',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'OwnableUnauthorizedAccount',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'enum AMMPolymarket.Option',
        name: 'result',
        type: 'uint8',
      },
    ],
    name: 'MarketClosed',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'question',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'initialLiquidity',
        type: 'uint256',
      },
    ],
    name: 'MarketCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'enum AMMPolymarket.Option',
        name: 'option',
        type: 'uint8',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'shares',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'cost',
        type: 'uint256',
      },
    ],
    name: 'SharePurchased',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'enum AMMPolymarket.Option',
        name: 'option',
        type: 'uint8',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'shares',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'reward',
        type: 'uint256',
      },
    ],
    name: 'ShareSold',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'payout',
        type: 'uint256',
      },
    ],
    name: 'WinningsClaimed',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'marketId',
        type: 'uint256',
      },
      {
        internalType: 'enum AMMPolymarket.Option',
        name: 'option',
        type: 'uint8',
      },
    ],
    name: 'getCurrentPrice',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'marketId',
        type: 'uint256',
      },
    ],
    name: 'getLiquidity',
    outputs: [
      {
        internalType: 'uint256',
        name: 'totalLiquidity',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'yesPool',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'noPool',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'marketId',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'getUserShares',
    outputs: [
      {
        internalType: 'uint256',
        name: 'yesShares',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'noShares',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'marketCounter',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'markets',
    outputs: [
      {
        internalType: 'string',
        name: 'question',
        type: 'string',
      },
      {
        internalType: 'bool',
        name: 'isOpen',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: 'resultDeclared',
        type: 'bool',
      },
      {
        internalType: 'enum AMMPolymarket.Option',
        name: 'finalResult',
        type: 'uint8',
      },
      {
        internalType: 'uint256',
        name: 'yesPool',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'noPool',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'usdc',
    outputs: [
      {
        internalType: 'contract IERC20',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.20;

// import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";

// contract AMMPolymarket is Ownable {
//     IERC20 public usdc;
//     uint256 public marketCounter;

//     enum Option { Yes, No }

//     struct Market {
//         string question;
//         bool isOpen;
//         bool resultDeclared;
//         Option finalResult;

//         uint256 yesPool;
//         uint256 noPool;

//         mapping(address => uint256) yesShares;
//         mapping(address => uint256) noShares;

//         mapping(address => bool) hasClaimed;
//     }

//     mapping(uint256 => Market) public markets;

//     event MarketCreated(uint256 indexed id, string question, uint256 initialLiquidity);
//     event SharePurchased(uint256 indexed id, address indexed user, Option option, uint256 shares, uint256 cost);
//     event ShareSold(uint256 indexed id, address indexed user, Option option, uint256 shares, uint256 reward);
//     event MarketClosed(uint256 indexed id, Option result);
//     event WinningsClaimed(uint256 indexed id, address indexed user, uint256 payout);

//     constructor(address _usdc) Ownable(msg.sender) {
//         usdc = IERC20(_usdc);
//     }

//     modifier marketExists(uint256 marketId) {
//         require(marketId < marketCounter, "Invalid market");
//         _;
//     }

//     function createMarket(string calldata _question, uint256 _initialLiquidity) external onlyOwner {
//         require(_initialLiquidity > 0, "Liquidity must be > 0");

//         require(usdc.transferFrom(msg.sender, address(this), _initialLiquidity), "USDC transfer failed");

//         Market storage m = markets[marketCounter];
//         m.question = _question;
//         m.isOpen = true;

//         // Split initial liquidity equally between YES and NO pools
//         m.yesPool = _initialLiquidity / 2;
//         m.noPool = _initialLiquidity / 2;

//         emit MarketCreated(marketCounter, _question, _initialLiquidity);
//         marketCounter++;
//     }

//     function getCurrentPrice(uint256 marketId, Option option) public view marketExists(marketId) returns (uint256) {
//         Market storage m = markets[marketId];
//         uint256 yes = m.yesPool;
//         uint256 no = m.noPool;
//         require(yes > 0 && no > 0, "Zero pool");

//         // Constant product formula based price
//         if (option == Option.Yes) {
//             return (1e6 * no) / (yes + no); // scaled price
//         } else {
//             return (1e6 * yes) / (yes + no); // scaled price
//         }
//     }

//     function buyShares(uint256 marketId, Option _option, uint256 usdcAmount) external marketExists(marketId) {
//         Market storage m = markets[marketId];
//         require(m.isOpen, "Market closed");
//         require(usdcAmount > 0, "Amount > 0");

//         require(usdc.transferFrom(msg.sender, address(this), usdcAmount), "USDC payment failed");

//         uint256 shares;
//         if (_option == Option.Yes) {
//             shares = getSharesOut(usdcAmount, m.yesPool, m.noPool);
//             m.yesPool += usdcAmount;
//             m.yesShares[msg.sender] += shares;
//         } else {
//             shares = getSharesOut(usdcAmount, m.noPool, m.yesPool);
//             m.noPool += usdcAmount;
//             m.noShares[msg.sender] += shares;
//         }

//         emit SharePurchased(marketId, msg.sender, _option, shares, usdcAmount);
//     }

//     function getSharesOut(uint256 inputAmount, uint256 buyPool, uint256 otherPool) internal pure returns (uint256) {
//         // x * y = k; calculate shares using simplified AMM curve
//         uint256 k = buyPool * otherPool;
//         uint256 newBuyPool = buyPool + inputAmount;
//         uint256 newOtherPool = k / newBuyPool;
//         uint256 sharesOut = otherPool - newOtherPool;
//         return sharesOut;
//     }

//     function closeMarket(uint256 marketId, Option result) external onlyOwner marketExists(marketId) {
//         Market storage m = markets[marketId];
//         require(m.isOpen, "Already closed");

//         m.isOpen = false;
//         m.resultDeclared = true;
//         m.finalResult = result;

//         emit MarketClosed(marketId, result);
//     }

//     function claimWinnings(uint256 marketId) external marketExists(marketId) {
//         Market storage m = markets[marketId];
//         require(m.resultDeclared, "Not resolved");
//         require(!m.hasClaimed[msg.sender], "Already claimed");

//         uint256 payout;
//         if (m.finalResult == Option.Yes) {
//             payout = (m.yesShares[msg.sender] * (m.yesPool + m.noPool)) / m.yesPool;
//         } else {
//             payout = (m.noShares[msg.sender] * (m.yesPool + m.noPool)) / m.noPool;
//         }

//         require(payout > 0, "No winnings");
//         m.hasClaimed[msg.sender] = true;
//         require(usdc.transfer(msg.sender, payout), "Payout failed");

//         emit WinningsClaimed(marketId, msg.sender, payout);
//     }

//     function getLiquidity(uint256 marketId) external view marketExists(marketId) returns (uint256 totalLiquidity, uint256 yesPool, uint256 noPool) {
//         Market storage m = markets[marketId];
//         return (m.yesPool + m.noPool, m.yesPool, m.noPool);
//     }

//     function getUserShares(uint256 marketId, address user) external view marketExists(marketId) returns (uint256 yesShares, uint256 noShares) {
//         Market storage m = markets[marketId];
//         return (m.yesShares[user], m.noShares[user]);
//     }
// }

// export function getPolyMarketContract2(signer: any) {
//   return new ethers.Contract(
//     POLYMARKET_CONTRACT_2_ADDRESS,
//     POLYMARKET_CONTRACT_2_ABI,
//     signer
//   );
// }

const CPMM_CONTRACT_ADDRESS = '0x058c79A51ae984b0940fb904EBf402E9aD0Fe860';
const CPMM_CONTRACT_ABI = [
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'marketId',
        type: 'uint256',
      },
      {
        internalType: 'enum PolymarketStylePrediction.Option',
        name: '_option',
        type: 'uint8',
      },
      {
        internalType: 'uint256',
        name: 'usdcAmount',
        type: 'uint256',
      },
    ],
    name: 'buyShares',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'marketId',
        type: 'uint256',
      },
    ],
    name: 'claimWinnings',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'marketId',
        type: 'uint256',
      },
      {
        internalType: 'enum PolymarketStylePrediction.Option',
        name: 'result',
        type: 'uint8',
      },
    ],
    name: 'closeMarket',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '_question',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: '_initialLiquidity',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_initialSharePrice',
        type: 'uint256',
      },
    ],
    name: 'createMarket',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_usdc',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'OwnableInvalidOwner',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'OwnableUnauthorizedAccount',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'enum PolymarketStylePrediction.Option',
        name: 'result',
        type: 'uint8',
      },
    ],
    name: 'MarketClosed',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'question',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'initialPrice',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'liquidity',
        type: 'uint256',
      },
    ],
    name: 'MarketCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'marketId',
        type: 'uint256',
      },
      {
        internalType: 'enum PolymarketStylePrediction.Option',
        name: '_option',
        type: 'uint8',
      },
      {
        internalType: 'uint256',
        name: 'shareAmount',
        type: 'uint256',
      },
    ],
    name: 'sellShares',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'enum PolymarketStylePrediction.Option',
        name: 'option',
        type: 'uint8',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'shares',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'cost',
        type: 'uint256',
      },
    ],
    name: 'SharePurchased',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'enum PolymarketStylePrediction.Option',
        name: 'option',
        type: 'uint8',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'shares',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'payout',
        type: 'uint256',
      },
    ],
    name: 'ShareSold',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'payout',
        type: 'uint256',
      },
    ],
    name: 'WinningsClaimed',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'marketId',
        type: 'uint256',
      },
      {
        internalType: 'enum PolymarketStylePrediction.Option',
        name: 'option',
        type: 'uint8',
      },
    ],
    name: 'getCurrentPrice',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'marketId',
        type: 'uint256',
      },
    ],
    name: 'getPoolState',
    outputs: [
      {
        internalType: 'uint256',
        name: 'totalYes',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'totalNo',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'liquidity',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'marketId',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'getShareBalances',
    outputs: [
      {
        internalType: 'uint256',
        name: 'yes',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'no',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'marketCounter',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'markets',
    outputs: [
      {
        internalType: 'string',
        name: 'question',
        type: 'string',
      },
      {
        internalType: 'bool',
        name: 'isOpen',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: 'resultDeclared',
        type: 'bool',
      },
      {
        internalType: 'enum PolymarketStylePrediction.Option',
        name: 'finalResult',
        type: 'uint8',
      },
      {
        internalType: 'uint256',
        name: 'totalYesShares',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'totalNoShares',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'liquidity',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'initialSharePrice',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'usdc',
    outputs: [
      {
        internalType: 'contract IERC20',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

export function getPolyMarketContract2(signer: any) {
  return new ethers.Contract(CPMM_CONTRACT_ADDRESS, CPMM_CONTRACT_ABI, signer);
}
