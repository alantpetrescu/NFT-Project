import { useEffect, useState } from 'react';
import contract from '../contracts/contract';

const useFetchNFTData = () => {
  const [cardData, setCardData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const tokenIds = [0];

        const dataPromises = tokenIds.map(async (id) => {
          try {
            const tokenURI = await contract.methods.tokenURI(id).call();
            console.log(tokenURI);
            const ipfsURL = tokenURI.replace('ipfs://', 'https://ipfs.io/ipfs/');
            const response = await fetch(ipfsURL);

            if (!response.ok) {
              throw new Error(`Failed to fetch metadata for token ${id}`);
            }

            const metadata = await response.json();
            const imageIpfsUrl = metadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/');
            if (isMounted) {
              return {
                id,
                image: imageIpfsUrl,
                title: metadata.name,
                details: metadata.description,
              };
            }
            return null; 
          } catch (error) {
            console.error(`Error fetching data for token ${id}:`, error);
            return null; 
          }
        });

        const results = await Promise.all(dataPromises);
        const filteredResults = results.filter(result => result !== null);
        if (isMounted) {
          setCardData(filteredResults);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  return { cardData, loading };
};

export default useFetchNFTData;
