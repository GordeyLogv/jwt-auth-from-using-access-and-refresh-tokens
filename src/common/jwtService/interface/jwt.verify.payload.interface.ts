export interface IJwtVerifyPayload {
  id: number;
  name: string;
  age: number;
  email: string;
  createdAt: string;
  updatedAt: string | null;
  iat: number;
  exp: number;
}
