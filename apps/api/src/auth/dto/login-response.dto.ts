import { Expose, Type } from 'class-transformer';

import { UserResponseDto } from '../../users/dto/user-response.dto';

export class LoginResponseDto {
  @Expose()
  accessToken!: string;

  @Expose()
  tokenType!: 'Bearer';

  @Expose()
  accessTokenExpiresAt!: string;

  @Expose()
  refreshToken!: string;

  @Expose()
  refreshTokenExpiresAt!: string;

  @Expose()
  @Type(() => UserResponseDto)
  user!: UserResponseDto;
}
