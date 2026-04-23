import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class UserResponseDto {
  @Expose()
  id: string;
  @Expose()
  name: string;
  @Expose()
  email: string;
  @Expose()
  emailVerified: string;
  @Expose()
  image?: string;
}

@Exclude()
export class ProfileResponseDto {
  @Expose()
  id: string;
  @Expose()
  userId: string;
  @Expose()
  @Type(() => UserResponseDto)
  user: UserResponseDto;
  @Expose()
  accountId: string;
  @Expose()
  providerId: string;
}
