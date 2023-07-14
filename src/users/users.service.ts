import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserDto } from './dto/user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(createUserDto: UserDto): Promise<void> {
    const { phoneNumber, password } = createUserDto;

    const user = new User();
    user.salt = await bcrypt.genSalt();
    user.phoneNumber = phoneNumber;
    user.password = await this.hashpassword(password, user.salt);

    try {
      await user.save();
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Phone number already exists');
      } else {
        throw error;
      }
    }
  }

  async signIn(authCredentialsDto: UserDto) {
    const username = await this.userRepository.validateUserPassword(
      authCredentialsDto,
    );

    if (!username) {
      throw new NotFoundException('Invalid credentials');
    }

    const payload = { phoneNumber: username };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }

  private async hashpassword(passport: string, salt: string): Promise<string> {
    return bcrypt.hash(passport, salt);
  }
}
