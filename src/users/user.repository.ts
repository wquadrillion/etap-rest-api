import { EntityRepository, Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { UserDto } from './dto/user.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async validateUserPassword(authCredentialsDto: UserDto) {
    const { phoneNumber, password } = authCredentialsDto;

    const user = await User.findOne({
      where: {
        phoneNumber: phoneNumber,
      },
    });

    if (user && (await user.validatePassword(password))) {
      return user.phoneNumber;
    } else {
      return null;
    }
  }
}
