import web3 from '../context/web3';

const sendTransaction = async (contractMethod, contractAddress, privateKey) => {
  const gasPrice = await web3.eth.getGasPrice(); // Get the current gas price
  const gasLimit = 2000000;

  const account = web3.eth.accounts.privateKeyToAccount(privateKey);
  web3.eth.accounts.wallet.add(account);

  const transactionParameters = {
    to: contractAddress,
    from: account.address,
    data: contractMethod.encodeABI(),
    gas: gasLimit,
    gasPrice: gasPrice,
  };

  // Sign the transaction
  const signedTx = await web3.eth.accounts.signTransaction(transactionParameters, privateKey);

  // Send the transaction
  const txReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

  console.log('Transaction receipt:', txReceipt);
  return txReceipt;
};

const isAddressValid = (address) => {
  return typeof address === 'string' && web3.utils.isAddress(address);
};

export { sendTransaction, isAddressValid };
