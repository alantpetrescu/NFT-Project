import { useState } from 'react';
import contract from '../contracts/contract';
import { sendTransaction, isAddressValid } from '../utils/transactionUtils';

const useMintNFT = () => {
  const [minting, setMinting] = useState(false);
  const [error, setError] = useState(null);

  const mintNFT = async (privateKey, toAddress, tokenId) => {
    setMinting(true);
    setError(null);

    try {
      if (!isAddressValid(toAddress)) {
        throw new Error('Invalid Ethereum address');
      }

      const mintTx = contract.methods.mint(toAddress, tokenId);
      await sendTransaction(mintTx, contract.options.address, privateKey);

      return true; // Success
    } catch (err) {
      console.error('Error sending transaction', err);
      setError(err.message);
      return false; // Failure
    } finally {
      setMinting(false);
    }
  };

  return { mintNFT, minting, error };
};

export default useMintNFT;
