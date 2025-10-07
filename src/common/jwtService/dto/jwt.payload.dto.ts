export class JwtPayloadDto {
  id: number;
  name: string;
  age: number;
  email: string;
  createdAt: Date;
  updatedAt: Date | null;
}
