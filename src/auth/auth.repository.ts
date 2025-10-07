import { Injectable } from '@nestjs/common';
import { IAuthRepository } from './auth.repository.interface';
import { Person } from '@prisma/client';
import { PersonEntity } from './entity/person.entity';
import { DatabaseService } from 'src/common/databaseService/datavase.service';

@Injectable()
export class AuthRepository implements IAuthRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  public async getByEmail(email: string): Promise<PersonEntity | null> {
    const existedPerson = await this.databaseService.person.findUnique({
      where: { email },
    });

    if (!existedPerson) {
      return null;
    }

    return this.toEntity(existedPerson);
  }

  public async create(person: PersonEntity): Promise<PersonEntity> {
    const newPerson = person.toPersistence();

    const createdPerson = await this.databaseService.person.create({
      data: newPerson,
    });

    return this.toEntity(createdPerson);
  }

  private toEntity(row: Person): PersonEntity {
    return PersonEntity.createPersonFromDb(row);
  }
}
