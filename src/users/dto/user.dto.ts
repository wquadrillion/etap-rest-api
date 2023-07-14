import { IsNotEmpty, IsString, Length, MinLength } from 'class-validator';

export class UserDto {
  @IsNotEmpty()
  @Length(11)
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;
}
