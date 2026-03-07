export interface LoginRequest {
  phone: string;
  password: string;
}

export type UserRole = 'ADMIN' | 'CUSTOMER' | 'INSTRUCTOR' | 'SHIPPER' | 'PROVIDER';

export interface RegisterRequest {
  username: string;
  email: string;
  phone: string;
  role: UserRole;
  password: string;
  confirmPassword: string;
  name?: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface UserAuthenticate {
  avatarUrl?: string;
  email?: string;
  employeeNo?: string;
  refreshToken?: string;
  refreshTokenExpiryTime?: Date | string;
  role?: string;
  token?: string;
  userId?: string;
}

export class RememberMe {
  constructor(
    public state: boolean,
    public username: string
  ) {}
}
