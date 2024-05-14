import web3 from '../context/web3';

const address = '0x97A7B9d5B08EF2FAe4e9460315EfEBe757F880F4';
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
