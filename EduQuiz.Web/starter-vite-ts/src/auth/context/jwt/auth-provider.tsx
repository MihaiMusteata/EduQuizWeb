import type { ReactNode } from 'react';

import { jwtDecode } from "jwt-decode";
import { useSetState } from 'minimal-shared/hooks';
import { useMemo, useEffect, useCallback } from 'react';

import { useRouter } from "src/routes/hooks";

import { useAxios } from "src/axios/hooks";

import { AuthContext } from '../auth-context';

import type { UserType, LoginData, AuthState, SignupData } from "../../types";

// ----------------------------------------------------------------------

type Props = {
  children: ReactNode;
};

export function AuthProvider({ children }: Props) {
  const { state, setState } = useSetState<AuthState>({ user: undefined, loading: true });
  const { jwt, axiosLogin, axiosDefault, setJwt } = useAxios();
  const router = useRouter();
  const login = (request: LoginData) =>
    axiosLogin
      .post(`auth/login`, request)
      .then((response) => {
        const { jwtToken } = response.data;
        localStorage.setItem("jwtToken", jwtToken);
        setJwt(jwtToken);
      })
      .catch((error) => {
        throw error;
      });

  const signup = (request: SignupData) =>
    axiosDefault
      .post(`auth/signup`, request)
      .then((response) => {
        if (response.status === 200) {
          router.push('/login');
        }
      })
      .catch((error) => {
        throw error;
      });

  const checkUserSession = useCallback(async () => {
    try {
      if (!jwt) {
        setState({ user: undefined, loading: false });
        return;
      }
      const decoded = jwtDecode<UserType>(jwt);
      setState({
        user: {
          id: decoded.id,
          email: decoded.email,
          firstName: decoded.firstName,
          lastName: decoded.lastName,
          nickname: decoded.nickname,
          role: decoded.role,
        },
        loading: false
      });
    } catch (error) {
      console.error(error);
      setState({ user: undefined, loading: false });
    }
  }, [setState, jwt]);

  useEffect(() => {
    checkUserSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user ? { ...state.user, role: state.user.nickname ? 'user' : 'guest' } : undefined,
      checkUserSession,
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      login,
      signup
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [checkUserSession, state.user, status]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
