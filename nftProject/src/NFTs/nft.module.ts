import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '../Prisma/prisma.service';
import {ConfigModule} from "@nestjs/config";
import {JwtStrategy} from "../Auth/auth.jwt.strategy";
import {Module} from "@nestjs/common";
import {NftController} from "./nft.controller";
import {NftService} from "./nft.service";

@Module({
    imports: [
        ConfigModule.forRoot(),
        PassportModule,
        JwtModule.register({
            secret: 'epita',
            signOptions: { expiresIn: '3600s' },
        }),
    ],
    controllers: [NftController],
    providers: [NftService, JwtStrategy, PrismaService],
    exports: [NftService],
})
export class NftModule {}
