import web3 from '../context/web3';

const address = '0xc5b47581196dB94bcCBdC64DB9F7dBF8a8448B06';
const abi = [
  {
    "constant": true,
    "inputs": [
      {
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "tokenURI",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
];

const contract = new web3.eth.Contract(abi, address);

export default contract;
