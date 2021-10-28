import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../Auth/auth.jwt.strategy';
import { PrismaService } from '../Prisma/prisma.service';
import { NftCollectionController } from './nftcollection.controller';
import { NftCollectionService } from './nftcollection.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PassportModule,
    JwtModule.register({
      secret: 'epita',
      signOptions: { expiresIn: '3600s' },
    }),
  ],
  controllers: [NftCollectionController],
  providers: [NftCollectionService, JwtStrategy, PrismaService],
})
export class NftCollectionModule {}
