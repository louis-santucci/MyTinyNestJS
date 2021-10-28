import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '../Prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from '../Auth/auth.jwt.strategy';
import { Module } from '@nestjs/common';
import { NftController } from './nft.controller';
import { NftService } from './nft.service';
import { MulterModule } from '@nestjs/platform-express';
import { AuthService } from '../Auth/auth.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PassportModule,
    JwtModule.register({
      secret: 'epita',
      signOptions: { expiresIn: '3600s' },
    }),
    MulterModule.register({
      dest: './files',
    }),
  ],
  controllers: [NftController],
  providers: [NftService, JwtStrategy, PrismaService, AuthService],
  exports: [NftService],
})
export class NftModule {}
