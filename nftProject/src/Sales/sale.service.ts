import {Injectable, Logger} from '@nestjs/common';
import {PrismaService} from "../Prisma/prisma.service";
import {JwtService} from "@nestjs/jwt";
import {SaleCreateDto} from "./DTO/sale-create.dto";

@Injectable()
export class SaleService {
    constructor(
        private prismaService: PrismaService,
        private jwtService: JwtService,
    ) {}

    private readonly logger = new Logger(SaleService.name);

    async getSales() {
        return this.prismaService.sale.findMany();
    }

    async createSale(sale: SaleCreateDto) {
        try {
            return this.prismaService.sale.create({
                data: sale,
            });
        } catch (e) {
            this.logger.error('Error adding new sale ', e);
        }
    }
}