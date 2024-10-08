import { useEffect, useState } from 'react';
import contract from '../contracts/contract';

const useFetchNFTData = () => {
  const [cardData, setCardData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const tokenIds = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];

        const dataPromises = tokenIds.map(async (id) => {
          try {
            const tokenURI = await contract.methods.tokenURI(id).call();
            const response = await fetch(tokenURI);

            if (!response.ok) {
              throw new Error(`Failed to fetch metadata for token ${id}`);
            }

            const metadata = await response.json();
            let owner = null;
            try {
              owner = await contract.methods.ownerOf(id).call();
            } catch (error) {}
            
            if (isMounted) {
              return {
                id,
                image: metadata.image,
                title: metadata.name,
                details: metadata.description,
                owner: owner || 'No owner'
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
