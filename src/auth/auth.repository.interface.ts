import { PersonEntity } from './entity/person.entity';

export interface IAuthRepository {
  getByEmail(email: string): Promise<PersonEntity | null>;
  create(person: PersonEntity): Promise<PersonEntity>;
}
