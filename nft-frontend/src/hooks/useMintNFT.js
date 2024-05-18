import { useState } from 'react';
import Web3 from 'web3';
import contract from '../contracts/contract';

const useMintNFT = () => {
  const [minting, setMinting] = useState(false);
  const [error, setError] = useState(null);

  const mintNFT = async (privateKey, toAddress, tokenId) => {
    setMinting(true);
    setError(null);

    try {
      const web3 = new Web3('https://rpc-amoy.polygon.technology');
      const formattedPrivateKey = privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`;
      const account = web3.eth.accounts.privateKeyToAccount(formattedPrivateKey);
      web3.eth.accounts.wallet.add(account);

      const gasLimit = 2000000;

      const mintTx = contract.methods.mint(toAddress, tokenId);
      await web3.eth.sendTransaction({
        from: account.address,
        to: contract.options.address,
        gas: gasLimit,
        data: mintTx.encodeABI()
      });

      return true; // Success
    } catch (err) {
      setError(err.message);
      return false; // Failure
    } finally {
      setMinting(false);
    }
  };

  return { mintNFT, minting, error };
};

export default useMintNFT;
