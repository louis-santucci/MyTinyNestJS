import {Controller, Get, Query, Param, Post, Request, Body} from '@nestjs/common';
import { SaleService } from './sale.service';
import { ApiTags } from '@nestjs/swagger';
import { ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { Role } from '.prisma/client';
import {SaleCreateDto} from "./DTO/sale-create.dto";

@ApiTags('sale')
@Controller('sale')
export class SaleController {
    constructor(private readonly saleService: SaleService) {}

    @Get('/')
    @ApiOperation({summary: 'Get all sales'})
    @ApiResponse({
        status: 200,
        description: 'The list of all sales',
        type: [Array],
    })
    async getSales() {
        return this.saleService.getSales();
    }

    @Post('/')
    @ApiOperation({summary: 'Add a sale'})
    @ApiResponse({
        status: 200,
        description: 'Sale added',
        type: [Array]
    })
    async createSale(@Body() body: SaleCreateDto) {
        return this.saleService.createSale(body);
    }
}