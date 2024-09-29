// Info: (20240928 - Murky) User api output formatter

import { Expose } from 'class-transformer';
import { IsEmail, IsInt } from 'class-validator';

export class UserDto {
  @Expose() // Info: (20240928 - Murky) Expose的才會出去給外面的json
  @IsInt()
  id: number;

  @Expose()
  @IsEmail()
  email: string;
}
