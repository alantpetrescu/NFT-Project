import { useState } from 'react';
import contract from '../contracts/contract';
import { requestAccount, sendTransaction } from '../utils/transactionUtils';

const useUpdateCollectionMetadata = () => {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);

  const updateMetadata = async (newName, newSymbol) => {
    setUpdating(true);
    setError(null);

    try {
      const account = await requestAccount();

      // Set new name
      const setNameTx = contract.methods.setName(newName);
      await sendTransaction(setNameTx, account, contract.options.address);

      // Set new symbol
      const setSymbolTx = contract.methods.setSymbol(newSymbol);
      await sendTransaction(setSymbolTx, account, contract.options.address);

      return true; 
    } catch (err) {
      console.error('Error sending transaction', err);
      setError(err.message);
      return false; 
    } finally {
      setUpdating(false);
    }
  };

  return { updateMetadata, updating, error };
};

export default useUpdateCollectionMetadata;
