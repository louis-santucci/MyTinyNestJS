import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Role, User } from '.prisma/client';
import { AuthCredentialsDto } from '../Users/DTO/auth-credentials.dto';
import { PrismaService } from '../Prisma/prisma.service';
import { UserCreateDto } from '../Users/DTO/user-create.dto';
import { JwtService } from '@nestjs/jwt';
import { SigninDto } from '../Users/DTO/signin.dto';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  // Logger for logging information on the console
  private readonly logger = new Logger(AuthService.name);

  // Static function to generate a random password
  private static generatePassword(): string {
    let pass = '';
    const availableChars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + 'abcdefghijklmnopqrstuvwxyz0123456789@#$';

    for (let i = 0; i < 16; i++) {
      const char = Math.floor(Math.random() * availableChars.length + 1);

      pass += availableChars.charAt(char);
    }

    return pass;
  }

  // Function that takes a AuthCredentialsDto and creates a user in the DB.
  // Returns the created user
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<User> {
    // Get info from the User DTO
    const { name, email, blockchainAddress } = authCredentialsDto;

    // Generates a random password that will be returned
    const generatedPassword = AuthService.generatePassword();

    const user: UserCreateDto = new UserCreateDto();
    user.name = name;
    user.email = email;
    user.blockchainAddress = blockchainAddress;
    user.password = generatedPassword;
    user.role = Role.USER;

    try {
      return this.prismaService.user.create({
        data: user,
      });
    } catch (e) {
      this.logger.error('Error adding new user ', e);
    }
  }

  // Function that takes an email and a string, and checks the validity of the parameters
  // Returns the generated JWT token, else returns a 401 response
  async signIn(signinDto: SigninDto) {
    try {
      const { email, password } = signinDto;
      const user = await this.validateUser(email, password);
      if (user !== null) {
        const payload = {
          id: user.id,
          email: user.email,
        };
        return {
          accessToken: this.jwtService.sign(payload),
        };
      } else {
        throw new HttpException('Invalid credentials', HttpStatus.FORBIDDEN);
      }
    } catch (e) {
      throw new HttpException('Invalid credentials', HttpStatus.FORBIDDEN);
    }
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.prismaService.user.findFirst({
      where: {
        email: email,
      },
    });
    if (!user) {
      return null;
    }
    const valid = password.localeCompare(user.password);
    if (valid === 0) {
      return user;
    }
    return null;
  }
}
