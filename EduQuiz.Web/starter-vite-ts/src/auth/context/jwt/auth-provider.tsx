import { useSetState } from 'minimal-shared/hooks';
import { useMemo, useEffect, useCallback, ReactNode } from 'react';

import { AuthContext } from '../auth-context';
import { useAxios } from "../../../axios/hooks";

import type { AuthState } from '../../types';

// ----------------------------------------------------------------------

type Props = {
  children: ReactNode;
};

export function AuthProvider({ children }: Props) {
  const { state, setState } = useSetState<AuthState>({ user: null, loading: false });
  const { axiosLogin, setJwt } = useAxios();

  const login = ({ email, password }: { email: string; password: string }) =>
    axiosLogin
      .post(`auth/login`, { email, password })
      .then((response) => {
        const { jwtToken } = response.data;
        sessionStorage.setItem("jwtToken", jwtToken);
        setJwt(jwtToken);
      })
      .catch((error) => {
        throw error;
      });

  const checkUserSession = useCallback(async () => {
    try {
      // const res = await axios.get(endpoints.auth.me);

      // const {user} = res.data;

      // setState({ user: { ...user, accessToken }, loading: false });
      setState({ user: null, loading: false });
    } catch (error) {
      console.error(error);
      setState({ user: null, loading: false });
    }
  }, [setState]);

  useEffect(() => {
    checkUserSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user ? { ...state.user, role: state.user?.role ?? 'admin' } : null,
      checkUserSession,
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      login,
    }),
    [checkUserSession, state.user, status]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
