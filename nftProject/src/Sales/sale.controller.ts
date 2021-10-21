import { Controller, Get, Query, Param } from '@nestjs/common';
import { SaleService } from './sale.service';
import { ApiTags } from '@nestjs/swagger';
import { ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { Role } from '.prisma/client';

@ApiTags('sale')
@Controller('sale')
export class SaleController {
    constructor(private readonly saleService: SaleService) {}

    @Get('/')
    @ApiOperation({summary: 'Sale'})
    @ApiResponse({
        status: 200,
        description: 'Sale',
        type: [Array]
    })
    createSale(): void {
        return this.saleService.createSale();
    }
}