import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class SessionResponseDto {
  @Expose()
  token: string;
}
