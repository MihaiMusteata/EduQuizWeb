import { useState } from 'react';

type PromiseFn<T, A = void> = (arg?: A) => Promise<T>;

interface UsePromiseResult<T, A = void> {
  execute: (arg?: A) => Promise<T>;
  isLoading: boolean;
  data: T | undefined;
  error: Error | undefined;
}

export function usePromise<T, A = void>(promiseFn: PromiseFn<T, A>): UsePromiseResult<T, A> {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<T | undefined>(undefined);
  const [error, setError] = useState<Error | undefined>(undefined);

  const execute = async (arg?: A): Promise<T> => {
    setIsLoading(true);
    setError(undefined);
    try {
      const result = await promiseFn(arg);
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
