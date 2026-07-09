export type UserRole = 'ADMIN' | 'MANAGER' | 'SOCIA' | 'CONSULTANT' | 'CLIENT';

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'BLOCKED' | 'PENDING_VERIFICATION';

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  phone?: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateUserInput = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
  phone?: string;
};

export type UpdateUserInput = Partial<Omit<CreateUserInput, 'password'>> & {
  status?: UserStatus;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = CreateUserInput;

export type AuthResponse = {
  user: User;
  tokens: AuthTokens;
};
