import {
  Controller,
  Get,
  Query,
  Post,
  Request,
  Body,
  UseGuards,
} from '@nestjs/common';
import { SaleService } from './sale.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { SaleCreateDto } from './DTO/sale-create.dto';
import { JwtAuthGuard } from '../Auth/jwt.auth.guard';
import {LimitDto} from "../Utils/pagination.utils";
import { SaleResponse } from './DTO/sale-response.dto';

@ApiTags('Sale')
@Controller('sale')
export class SaleController {
  constructor(private readonly saleService: SaleService) {}

  @Get('/')
  @ApiOperation({ summary: 'Get all sales' })
  @ApiResponse({
    status: 200,
    description: 'The list of all sales',
    type: [SaleResponse]
  })
  @ApiQuery({
    name: 'limit',
    type: LimitDto,
    description: 'The number of returned NFTs',
    required: false,
  })
  async getSales(@Query('limit') limit = 10,) {
    return this.saleService.getSales(Number(limit));
  }

  @Get('/ownsales')
  @ApiOperation({ summary: 'Get own sales' })
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'The list of all sales you\'ve made',
    type: [SaleResponse],
  })
  async getOwnSales(@Request() req) {
    return this.saleService.getOwnSales(req.user.email);
  }

  @Get('/bestsellingteam')
  @ApiOperation({ summary: 'Get own sales' })
  @ApiResponse({
    status: 200,
    description: 'The best selling team',
    type: [Array],
  })
  async getBestSellingTeam() {
    return this.saleService.getBestSellingTeam();
  }

  @Get('/bestsellingcollection')
  @ApiOperation({ summary: 'Get best selling collection' })
  @ApiResponse({
    status: 200,
    description: 'The best selling collection',
    type: [Array],
  })
  async getBestSellingCollection() {
    return this.saleService.getBestSellingCollection();
  }

  @Post('/')
  @ApiOperation({ summary: 'Add a sale only if you own the NFT' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'Sale added',
    type: SaleResponse,
  })
  async createSale(@Body() body: SaleCreateDto, @Request() req) {
    return this.saleService.createSale(body, req.user.email);
  }
}
