import { useEffect, useState } from 'react';
import contract from '../contracts/contract';

const useFetchCollectionMetadata = () => {
  const [collectionName, setCollectionName] = useState('');
  const [collectionSymbol, setCollectionSymbol] = useState('');
  const [loadingMetadata, setLoadingMetadata] = useState(true);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const name = await contract.methods.name().call();
        const symbol = await contract.methods.symbol().call();
        setCollectionName(name);
        setCollectionSymbol(symbol);
      } catch (error) {
        console.error('Error fetching collection metadata:', error);
      } finally {
        setLoadingMetadata(false);
      }
    };

    fetchMetadata();
  }, []);

  return { collectionName, collectionSymbol, loadingMetadata };
};

export default useFetchCollectionMetadata;
