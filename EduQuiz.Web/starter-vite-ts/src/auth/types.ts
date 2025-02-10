export type SignupData = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export type LoginData = {
  email: string;
  password: string;
};

export type UserType = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export type AuthState = {
  user: UserType | undefined;
  loading: boolean;
};

export type AuthContextValue = {
  user: UserType | undefined;
  loading: boolean;
  authenticated: boolean;
  unauthenticated: boolean;
  checkUserSession?: () => Promise<void>;
  login: (request: LoginData) => Promise<void>;
  signup: (request: SignupData) => Promise<void>;
};
