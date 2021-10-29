import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';
import { JwtStrategy } from '../Auth/auth.jwt.strategy';
import { PrismaService } from '../Prisma/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PassportModule,
    JwtModule.register({
      secret: 'epita',
      signOptions: { expiresIn: '3600s' },
    }),
  ],
  controllers: [TeamController],
  providers: [TeamService, JwtStrategy, PrismaService],
})
export class TeamModule {}
