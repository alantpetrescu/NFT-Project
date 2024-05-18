import { useState } from 'react';
import contract from '../contracts/contract';
import { requestAccount, sendTransaction } from '../utils/transactionUtils';

const useMintNFT = () => {
  const [minting, setMinting] = useState(false);
  const [error, setError] = useState(null);

  const mintNFT = async (toAddress, tokenId) => {
    setMinting(true);
    setError(null);

    try {
      const account = await requestAccount();

      const mintTx = contract.methods.mint(toAddress, tokenId);
      await sendTransaction(mintTx, account, contract.options.address);

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
