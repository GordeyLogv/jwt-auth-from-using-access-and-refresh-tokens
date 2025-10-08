import { IJwtVerifyPayload } from '../common/jwtService/interface/jwt.verify.payload.interface';
import { PersonEntity } from 'src/auth/entity/person.entity';

declare global {
  namespace Express {
    export interface Request {
      token: string;
      person: IJwtVerifyPayload | PersonEntity;
    }
  }
}
