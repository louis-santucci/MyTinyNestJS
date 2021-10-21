import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './Users/user.module';
import { TeamModule } from './Teams/team.module';
import { SaleModule } from './Sales/sale.module';
import { NftModule } from './NFTs/nft.module';
import { NftCollectionModule } from './NFTCollections/nftcollection.module';
import { AuthModule } from './Auth/auth.module';
import { PrismaModule } from './Prisma/prisma.module';

@Module({
  imports: [
    UserModule,
    TeamModule,
    SaleModule,
    NftModule,
    NftCollectionModule,
    AuthModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
