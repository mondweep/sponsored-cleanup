const Web3 = require('web3');
const provider = new Web3.providers.HttpProvider('http://127.0.0.1:9545/');
const web3 = new Web3(provider);

const contractAddress = '0xF0deD2e48A71eC3f268538610BA0c0Ca1F983f66';
const contractAbi = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "bidId",
        "type": "uint256"
      }
    ],
    "name": "BidAccepted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "bidId",
        "type": "uint256"
      }
    ],
    "name": "BidCleanedUp",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "bidId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "bidder",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "cleanupScale",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "payment",
        "type": "uint256"
      }
    ],
    "name": "BidPlaced",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "bids",
    "outputs": [
      {
        "internalType": "address payable",
        "name": "bidder",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "cleanupScale",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "payment",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "accepted",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "cleanedUp",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "cleanupCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address payable",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "cleanupScale",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "payment",
        "type": "uint256"
      }
    ],
    "name": "placeBid",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function",
    "payable": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "bidId",
        "type": "uint256"
      }
    ],
    "name": "acceptBid",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "bidId",
        "type": "uint256"
      }
    ],
    "name": "cleanUp",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getCleanupCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  }
];

const contract = new web3.eth.Contract(contractAbi, contractAddress);

contract.setGreeting("Hello, World!", function(err, result) {
    if (err) {
      console.error(err);
      return;
    }
  
    console.log(result);
  });
  

const bidForm = document.getElementById('bid-form');
const bidHistory = document.getElementById('bid-history');

bidForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const cleanupScale = event.target.elements['cleanup-scale'].value;
  const payment = event.target.elements['payment'].value;
  const accounts = await web3.eth.requestAccounts();
  const from = accounts[0];
  await contract.methods.placeBid(cleanupScale, payment).send({ from, value: payment });
  const bidCount = await contract.methods.cleanupCount().call();
  for (let i = 1; i <= bidCount; i++) {
    const bid = await contract.methods.bids(i).call();
    const bidElement = document.createElement('div');
    bidElement.textContent = `Bid ${i}: cleanupScale = ${bid.cleanupScale}, payment = ${bid.payment}`;
    bidHistory.appendChild(bidElement);
  }
});
