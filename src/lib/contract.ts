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
