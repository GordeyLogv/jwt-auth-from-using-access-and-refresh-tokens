import { PersonRow } from './type/person.row.type';
import * as bcrypt from 'bcrypt';

export class PersonEntity {
  private constructor(
    private readonly _id: number | null,
    private _name: string,
    private _age: number,
    private _email: string,
    private _hashPassword: string | null,
    private _createdAt: Date,
    private _updatedAt: Date | null,
  ) {}

  public static createNewPerson(data: {
    email: string;
    name: string;
    age: number;
  }): PersonEntity {
    return new PersonEntity(
      null,
      data.name,
      data.age,
      data.email,
      null,
      new Date(),
      null,
    );
  }

  public static createPersonFromDb(row: PersonRow): PersonEntity {
    return new PersonEntity(
      row.id,
      row.name,
      row.age,
      row.email,
      row.hashPassword,
      row.createdAt,
      row.updatedAt,
    );
  }

  public async setHashPassword(password: string, salt: number): Promise<void> {
    this._hashPassword = await bcrypt.hash(password, salt);
  }

  public setNewName(name: string): void {
    this._name = name;
  }

  public setNewAge(age: number): void {
    this._age = age;
  }

  public setNewEmail(email: string): void {
    this._email = email;
  }

  public setUpdatedAt(): void {
    this._updatedAt = new Date();
  }

  public comparePassword(password: string): Promise<boolean> {
    if (!this._hashPassword) {
      throw new Error('Hash password is not set');
    }

    return bcrypt.compare(password, this._hashPassword);
  }

  public birthDay(): void {
    this._age++;
  }

  public toPersistence(): Omit<PersonRow, 'id'> {
    if (!this._hashPassword) {
      throw new Error('Hash password is not set');
    }

    return {
      name: this._name,
      age: this._age,
      email: this._email,
      hashPassword: this._hashPassword,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }

  public toObject(): PersonRow {
    if (!this._id || !this._hashPassword) {
      throw new Error('Id or hash password is not set');
    }
    return {
      id: this._id,
      name: this._name,
      age: this._age,
      email: this._email,
      hashPassword: this._hashPassword,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }

  public toResponse(): Omit<PersonRow, 'hashPassword'> {
    if (!this._id) {
      throw new Error('Id is not set');
    }

    return {
      id: this._id,
      name: this._name,
      age: this._age,
      email: this._email,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
