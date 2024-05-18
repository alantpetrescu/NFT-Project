import { useState } from 'react';
import contract from '../contracts/contract';
import { requestAccount, sendTransaction } from '../utils/transactionUtils';

const useTransferNFT = () => {
  const [transferring, setTransferring] = useState(false);
  const [error, setError] = useState(null);

  const transferNFT = async (toAddress, tokenId) => {
    setTransferring(true);
    setError(null);

    try {
      const account = await requestAccount();

      const transferTx = contract.methods.transferFrom(account, toAddress, tokenId);
      await sendTransaction(transferTx, account, contract.options.address);

      return true; // Success
    } catch (err) {
      console.error('Error sending transaction', err);
      setError(err.message);
      return false; // Failure
    } finally {
      setTransferring(false);
    }
  };

  return { transferNFT, transferring, error };
};

export default useTransferNFT;
