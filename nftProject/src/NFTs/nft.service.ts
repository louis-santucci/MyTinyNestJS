import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../Prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { NftUpdateDto } from './DTO/nft-update.dto';
import { NftCreateDto } from './DTO/nft-create-dto';
import { NftRateDto } from './DTO/nft-rate-dto';

@Injectable()
export class NftService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  private readonly logger = new Logger(NftService.name);

  async getNFTs(offset?: number, limit?: number) {
    if (offset < 0) {
      throw new HttpException("The offset cannot be inferior to 0", HttpStatus.FORBIDDEN);
    }
    if (limit < 1) {
      throw new HttpException("The limit cannot be inferior to 1", HttpStatus.FORBIDDEN);
    }
    return this.prismaService.nft.findMany({
      where: {
        status: 'PUBLISHED',
      },
      orderBy: {
        id: 'asc',
      },
      take: limit,
      skip: offset,
    });
  }

  async searchNFT(name: string, offset: number, limit: number) {
    const nfts = await this.getNFTs();
    name = name.toLowerCase();

    if (offset < 0) {
      throw new HttpException("The offset cannot be inferior to 0", HttpStatus.FORBIDDEN);
    }
    if (limit < 1) {
      throw new HttpException("The limit cannot be inferior to 1", HttpStatus.FORBIDDEN);
    }

    if (nfts === null) {
      return null;
    }
    const results = [];
    nfts.forEach((nft) => {
      if (nft.name.toLowerCase().includes(name)) {
        results.push(nft);
      }
    });
    return results.slice(offset, limit + offset);
  }

  async getNFT(nftId: number) {
    return this.prismaService.nft.findUnique({
      where: {
        id: Number(nftId),
      },
    });
  }

  async createNFT(body: NftCreateDto, userEmail: string, filename: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: userEmail,
      },
    });
    if (user.id != body.userId) {
      throw new HttpException(
        'Only the author of the NFT can create an NFT',
        HttpStatus.FORBIDDEN,
      );
    }
    try {
      return this.prismaService.nft.create({
        data: {
          name: body.name,
          userId: Number(body.userId),
          imageName: filename,
          price: Number(body.price),
          status: body.status,
          history: '' + body.userId,
          rate: -1,
          nbRates: 0,
        },
      });
    } catch (e) {
      this.logger.error('Error adding nft', e);
    }
  }

  async updateNft(
    id: number,
    nft: NftUpdateDto,
    userEmail: string,
    filename: string,
  ) {
    this.logger.log({nft});
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          email: userEmail,
        },
      });

      // Getting current NFT with its ID
      const oldNft = await this.getNFT(id);
      this.logger.log({oldNft})
      if (user.id != oldNft.userId) {
        throw new HttpException(
          'You are not the owner, you cannot modify it.',
          HttpStatus.FORBIDDEN,
        );
      }
      const oldFilename = oldNft.imageName;

      const res = await this.prismaService.nft.update({
        data: {
          name: nft.name,
          price: Number(nft.price),
          status: nft.status,
          imageName: filename,
          id: undefined,
        },
        where: {
          id,
        },
      });

      // Fs is used to delete old image
      const fs = await import('fs');

      fs.unlinkSync('./files/' + oldFilename);

      return res;
    } catch (e) {
      this.logger.error('Error updating nft', e);
    }
  }

  async getHighestRatedNft() {
    return await this.prismaService.nft.findFirst({
      where: { rate: { gt: -1 } },
      orderBy: {
        rate: 'desc',
      },
    });
  }

  async getMostRatedNft() {
    return await this.prismaService.nft.findFirst({
      where: { nbRates: { gt: 0 } },
      orderBy: {
        nbRates: 'desc',
      },
    });
  }

  async rateNft(idToRate: number, email: string, body: NftRateDto) {
    let newRate;
    const user = await this.prismaService.user.findUnique({
      where: {
        email: email,
      },
    });

    const nft = await this.prismaService.nft.findUnique({
      where: {
        id: Number(idToRate),
      },
    });

    if (nft === null) {
      throw new HttpException(
        "The wanted NFT doesn't exist.",
        HttpStatus.NOT_FOUND,
      );
    }

    if (nft.nftCollectionId != null) {
      const collection = await this.prismaService.nftCollection.findUnique({
        where: {
          id: nft.nftCollectionId,
        },
      });
      if (user.teamId === collection.teamId) {
        throw new HttpException(
          "You can not rate your teammates' nft",
          HttpStatus.FORBIDDEN,
        );
      }
    }

    if (user.id === nft.userId) {
      throw new HttpException(
        'You can not rate your own nft',
        HttpStatus.FORBIDDEN,
      );
    }

    const rateNumber = nft.nbRates + 1;
    if (rateNumber === 1) {
      newRate = body.rate;
    } else {
      newRate = (nft.rate * rateNumber + body.rate) / (rateNumber + 1);
    }
    try {
      return await this.prismaService.nft.update({
        data: {
          ...nft,
          id: undefined,
          rate: newRate,
          nbRates: rateNumber,
        },
        where: {
          id: Number(idToRate),
        },
      });
    } catch (e) {
      this.logger.error('Error rating nft', e);
    }
  }
}
