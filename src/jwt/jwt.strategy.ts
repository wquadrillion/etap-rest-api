import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayload } from './jwt-payload.interface';
import { UserRepository } from '../users/user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'MY_TOP_SECRET',
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { phoneNumber } = payload;
    const user = await User.findOne({
      where: {
        phoneNumber: phoneNumber,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
