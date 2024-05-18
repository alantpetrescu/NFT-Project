import { useState } from 'react';
import Web3 from 'web3';
import contract from '../contracts/contract';

const useUpdateCollectionMetadata = () => {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);

  const updateMetadata = async (privateKey, newName, newSymbol) => {
    setUpdating(true);
    setError(null);

    try {
      const web3 = new Web3('https://rpc-amoy.polygon.technology');
      const formattedPrivateKey = privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`;
      const account = web3.eth.accounts.privateKeyToAccount(formattedPrivateKey);
      web3.eth.accounts.wallet.add(account);

      const gasLimit = 2000000;

      // Set new name
      const setNameTx = contract.methods.setName(newName);
      await web3.eth.sendTransaction({
        from: account.address,
        to: contract.options.address,
        gas: gasLimit,
        data: setNameTx.encodeABI()
      });

      // Set new symbol
      const setSymbolTx = contract.methods.setSymbol(newSymbol);
      await web3.eth.sendTransaction({
        from: account.address,
        to: contract.options.address,
        gas: gasLimit,
        data: setSymbolTx.encodeABI()
      });

      return true; // Success
    } catch (err) {
      setError(err.message);
      return false; // Failure
    } finally {
      setUpdating(false);
    }
  };

  return { updateMetadata, updating, error };
};

export default useUpdateCollectionMetadata;
