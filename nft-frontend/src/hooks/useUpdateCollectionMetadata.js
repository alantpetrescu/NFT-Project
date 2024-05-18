import { useState } from 'react';
import contract from '../contracts/contract';
import { sendTransaction } from '../utils/transactionUtils';

const useUpdateCollectionMetadata = () => {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);

  const updateMetadata = async (privateKey, newName, newSymbol) => {
    setUpdating(true);
    setError(null);

    try {
      const setNameTx = contract.methods.setName(newName);
      await sendTransaction(setNameTx, contract.options.address, privateKey);

      const setSymbolTx = contract.methods.setSymbol(newSymbol);
      await sendTransaction(setSymbolTx, contract.options.address, privateKey);

      return true; // Success
    } catch (err) {
      console.error('Error sending transaction', err);
      setError(err.message);
      return false; // Failure
    } finally {
      setUpdating(false);
    }
  };

  return { updateMetadata, updating, error };
};

export default useUpdateCollectionMetadata;
