import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  ValidationPipe,
  Logger,
  Get,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from '../Users/DTO/auth-credentials.dto';
import { JwtAuthGuard } from './jwt.auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SigninDto } from '../Users/DTO/signin.dto';
import { UserResponse } from '../Users/DTO/user-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  private readonly logger = new Logger(AuthController.name);

  @Post('/signup')
  @ApiOperation({ summary: 'Signs up a new user' })
  @ApiResponse({
    status: 201,
    description: 'The generated password for this user',
    type: String,
  })
  @ApiResponse({
    status: 400,
    description: 'The user could not be created',
  })
  @ApiBody({
    type: AuthCredentialsDto,
    description: 'New user',
  })
  async signUp(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<any> {
    return this.authService.signUp(authCredentialsDto);
  }

  @ApiOperation({ summary: 'Logs a user in' })
  @ApiResponse({
    status: 200,
    description: 'The JWT Token to use as Bearer Token',
    type: String,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad credentials',
  })
  @ApiBody({
    type: SigninDto,
    description: 'The credentials',
  })
  @HttpCode(200)
  @Post('/signin')
  async signIn(@Body() signinDto: SigninDto) {
    return this.authService.signIn(signinDto);
  }

  @ApiOperation({
    summary:
      'Gets the email of the connected user with the JWT Token if connected, made for development purposes',
  })
  @ApiResponse({
    status: 200,
    description: 'The email of the user',
    type: UserResponse,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Get('/me')
  getMe(@Request() req) {
    return req.user;
  }
}
