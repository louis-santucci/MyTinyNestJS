import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '../Prisma/prisma.service';
import {SaleController} from "./sale.controller";
import {SaleService} from "./sale.service";
import {ConfigModule} from "@nestjs/config";
import {JwtStrategy} from "../Auth/auth.jwt.strategy";
import {Module} from "@nestjs/common";

@Module({
    imports: [
        ConfigModule.forRoot(),
        PassportModule,
        JwtModule.register({
            secret: 'epita',
            signOptions: { expiresIn: '3600s' },
        }),
    ],
    controllers: [SaleController],
    providers: [SaleService, JwtStrategy, PrismaService],
    exports: [SaleService],
})
export class SaleModule {}
