import {
  verify as jwtVerify,
  JwtPayload,
  Secret,
  VerifyOptions,
} from 'jsonwebtoken';

export function verifyJwt<T extends JwtPayload>(
  token: string,
  secret: Secret,
  options?: VerifyOptions,
): T | null {
  try {
    return jwtVerify(token, secret, options) as T;
  } catch {
    return null;
  }
}
