export class CreateUserDto {
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
}
