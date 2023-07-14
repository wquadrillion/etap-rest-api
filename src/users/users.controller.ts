import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/signup')
  signUp(@Body(ValidationPipe) createUserDto: UserDto): Promise<void> {
    return this.usersService.signUp(createUserDto);
  }

  @Post('/signin')
  signIn(@Body(ValidationPipe) authCredentialsDto: UserDto) {
    return this.usersService.signIn(authCredentialsDto);
  }
}
