import { IsEmail } from "class-validator";
import { IsString, Matches, MaxLength, MinLength } from "class-validator";

export class LoginUserDto {

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(
      /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
      message: 'Need to be a strong Password'
  })
  password: string;

}
