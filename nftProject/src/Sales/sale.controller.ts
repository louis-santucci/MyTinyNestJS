import {Controller, Get, Query, Param, Post, Request, Body, UseGuards} from '@nestjs/common';
import { SaleService } from './sale.service';
import {ApiBearerAuth, ApiTags} from '@nestjs/swagger';
import { ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { Role } from '.prisma/client';
import {SaleCreateDto} from "./DTO/sale-create.dto";
import {JwtAuthGuard} from "../Auth/jwt.auth.guard";

@ApiTags('Sale')
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
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiResponse({
        status: 200,
        description: 'Sale added',
        type: [Array]
    })
    async createSale(@Body() body: SaleCreateDto, @Request() req) {
        return this.saleService.createSale(body, req.user.email);
    }
}
