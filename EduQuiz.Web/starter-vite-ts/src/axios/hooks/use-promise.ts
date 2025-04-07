import { useState } from 'react';

type PromiseFn<T> = () => Promise<T>;

interface UsePromiseResult<T> {
  execute: () => Promise<T>;
  isLoading: boolean;
  data: T | undefined;
  error: Error | undefined;
}

export function usePromise<T>(promiseFn: PromiseFn<T>): UsePromiseResult<T> {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<T | undefined>(undefined);
  const [error, setError] = useState<Error | undefined>(undefined);

  const execute = async () => {
    console.log("run")

    setIsLoading(true);
    setError(undefined);
    try {
      const result = await promiseFn();
      setData(result);
      return result;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Unknown error');
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { execute, isLoading, data, error };
}
