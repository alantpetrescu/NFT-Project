import { useState } from 'react';
import contract from '../contracts/contract';
import { sendTransaction, isAddressValid } from '../utils/transactionUtils';

const useTransferNFT = () => {
  const [transferring, setTransferring] = useState(false);
  const [error, setError] = useState(null);

  const transferNFT = async (privateKey, toAddress, tokenId) => {
    setTransferring(true);
    setError(null);

    try {
      if (!isAddressValid(toAddress)) {
        throw new Error('Invalid Ethereum address');
      }

      const fromAddress = await contract.methods.ownerOf(tokenId).call();

      if (!isAddressValid(fromAddress)) {
        throw new Error('Invalid from address');
      }

      const transferTx = contract.methods.transferFrom(fromAddress, toAddress, tokenId);
      await sendTransaction(transferTx, contract.options.address, privateKey);

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
