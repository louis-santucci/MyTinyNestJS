import { Module } from '@nestjs/common';
import { SaleController } from './sale.controller';
import { SaleService } from './sale.service';

@Module({
    imports: [],
    controllers: [SaleController],
    providers: [SaleService],
})
export class SaleModule {}