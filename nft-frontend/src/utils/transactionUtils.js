import Web3 from 'web3';

const requestAccount = async () => {
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      return accounts[0];
    } catch (error) {
      console.error('User denied account access', error);
      throw error;
    }
  } else {
    console.error('MetaMask is not installed');
    throw new Error('MetaMask is not installed');
  }
};

const sendTransaction = async (contractMethod, account, contractAddress) => {
  const web3 = new Web3(window.ethereum);
  const gasPrice = web3.utils.toWei('10', 'gwei');
  const gasLimit = 2000000;

  const transactionParameters = {
    to: contractAddress,
    from: account,
    data: contractMethod.encodeABI(),
    gas: gasLimit,
    gasPrice: gasPrice,
  };

  const txHash = await window.ethereum.request({
    method: 'eth_sendTransaction',
    params: [transactionParameters],
  });

  console.log('Transaction sent:', txHash);
  return txHash;
};

export { requestAccount, sendTransaction };
