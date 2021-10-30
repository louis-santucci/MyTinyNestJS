import {HttpException, HttpStatus, Injectable, Logger} from '@nestjs/common';
import { PrismaService } from '../Prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { SaleCreateDto } from './DTO/sale-create.dto';

@Injectable()
export class SaleService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  private readonly logger = new Logger(SaleService.name);

  async getSales(limit?: number) {
    if (limit < 1) {
      throw new HttpException(
          'The limit cannot be inferior to 1',
          HttpStatus.FORBIDDEN,
      );
    }
    return this.prismaService.sale.findMany({
      take: limit,
    });
  }

  async createSale(sale: SaleCreateDto, userEmail: string) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          email: userEmail,
        },
      });

      if (user.id != sale.sellerId) {
        return 'Only the seller can make a sell';
      }

      const tmp = this.prismaService.sale.create({
        data: sale,
      });

      const nft = await this.prismaService.nft.findUnique({
        where: {
          id: sale.nftId,
        },
      });

      await this.prismaService.nft.update({
        where: {
          id: sale.nftId,
        },
        data: {
          history: nft.history + ' ' + sale.buyerId,
          userId: sale.buyerId,
        },
      });

      this.logger.log(
        '[SALE] NFT sold { timestamp:' +
          new Date() +
          ', buyerId:' +
          sale.buyerId +
          ', sellerId:' +
          sale.sellerId +
          ', nftId:' +
          sale.nftId +
          '}',
      );
      return tmp;
    } catch (e) {
      this.logger.error('Error adding new sale ', e);
    }
  }

  async getOwnSales(userEmail: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: userEmail,
      },
    });
    try {
      return await this.prismaService.sale.findMany({
        where: {
          sellerId: user.id
        },
      });
    } catch (e) {
      this.logger.error("Error getting your sales", e);
    }
  }

  async getBestSellingTeam() {
    return Promise.resolve(undefined);
  }

  async getBestSellingCollection() {
    return Promise.resolve(undefined);
  }
}
