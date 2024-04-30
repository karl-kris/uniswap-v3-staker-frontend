import { useState, useEffect, useCallback } from 'react';
import BigNumber from 'bignumber.js';

const useTokenStatistics = () => {
  const [priceUsd, setPriceUsd] = useState<BigNumber>(new BigNumber(0.001));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>(undefined);

  const fetchTokenStatistics = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('https://balance.mchain.network/price', {
        headers: { Accept: 'application/json;version=20230302' },
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      const price = new BigNumber(data.results.data.attributes.price_usd);

      if (price.isZero()) {
        setTimeout(fetchTokenStatistics, 10000); // Retry after 10 seconds
      } else {
        setPriceUsd(price);
      }
    } catch (error) {
      setError(
        error instanceof Error ? error : new Error('An unknown error occurred')
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTokenStatistics();
  }, [fetchTokenStatistics]);

  return { priceUsd, isLoading, error };
};

export default useTokenStatistics;
