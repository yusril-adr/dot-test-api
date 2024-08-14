import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '@entities/user.entity';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { UserService } from '../user.service';
import { UserRegisterV1Dto } from '../dto/user-register-v1.dto';
import { ConfigService } from '@nestjs/config';
import { UserLoginV1Dto } from '../dto/user-login-v1.dto';
import { JWTPayload } from '@helpers/types/jwt-payload.type';

@Injectable()
export class UserV1UseCase {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  async register(request: UserRegisterV1Dto): Promise<User> {
    const isUsernameExist = await this.userService.findByUserName(
      request.username,
    );
    if (isUsernameExist) {
      throw new ConflictException(`Username already exist`);
    }

    const isEmailExist = await this.userService.findByEmail(request.email);
    if (isEmailExist) {
      throw new ConflictException(`Email already exist`);
    }

    return await this.userService.create({
      ...request,
      password: bcrypt.hashSync(
        request.password,
        parseInt(this.configService.get('SALT_ROUND')),
      ),
    });
  }

  async login(request: UserLoginV1Dto): Promise<{ access_token: string }> {
    const { identifier, password } = request;
    const user = await this.userService.findByIdentifier(identifier);

    if (!user) {
      throw new NotFoundException("User doesn't exist");
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      throw new UnauthorizedException('Credentials Failed.');
    }

    const accessToken = jwt.sign(
      { id: user.id } as JWTPayload,
      this.configService.get('ACCESS_TOKEN_KEY'),
      { expiresIn: '1d' },
    );

    return { access_token: accessToken };
  }

  async loginByToken(request: string): Promise<Omit<User, 'password'>> {
    const decoded = jwt.verify(
      request,
      this.configService.get('ACCESS_TOKEN_KEY'),
    );

    const { id } = decoded as JWTPayload;

    const user = await this.userService.findById(id);

    if (!user) {
      throw new NotFoundException("User doesn't exist");
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...formatedUser } = user;
    return formatedUser;
  }

  async findById(id: number): Promise<Omit<User, 'password'>> {
    const user = await this.userService.findById(id);

    if (!user) throw new NotFoundException("User doesn't exist");

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...formatedUser } = user;
    return formatedUser;
  }
}
