import { useState, useEffect } from 'react';
import contract from '../contracts/contract';

const useFetchCollectionMetadata = () => {
  const [metadata, setMetadata] = useState({ name: '', symbol: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const name = await contract.methods.name().call();
        const symbol = await contract.methods.symbol().call();
        setMetadata({ name, symbol });
      } catch (err) {
        console.error('Error fetching collection metadata', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMetadata();
  }, []);

  return { metadata, loading, error };
};

export default useFetchCollectionMetadata;
