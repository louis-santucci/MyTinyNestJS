import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../Prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { NftUpdateDto } from './DTO/nft-update.dto';
import { NftCreateDto } from './DTO/nft-create-dto';
import { NftRateDto } from './DTO/nft-rate-dto';
import { Status, Role } from '.prisma/client';
import { use } from 'passport';

@Injectable()
export class NftService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  private readonly logger = new Logger(NftService.name);

  async getNFTs(offset?: number, limit?: number) {
    if (offset < 0) {
      throw new HttpException(
        'The offset cannot be inferior to 0',
        HttpStatus.FORBIDDEN,
      );
    }
    if (limit < 1) {
      throw new HttpException(
        'The limit cannot be inferior to 1',
        HttpStatus.FORBIDDEN,
      );
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
      throw new HttpException(
        'The offset cannot be inferior to 0',
        HttpStatus.FORBIDDEN,
      );
    }
    if (limit < 1) {
      throw new HttpException(
        'The limit cannot be inferior to 1',
        HttpStatus.FORBIDDEN,
      );
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
    this.logger.log(nftId);
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
    if (user.id != body.userId && user.role !== Role.ADMIN) {
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
          status: Status.DRAFT,
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
    const user = await this.prismaService.user.findUnique({
      where: {
        email: userEmail,
      },
    });

    // Getting current NFT with its ID
    const oldNft = await this.getNFT(id);
    if (user.id != oldNft.userId && user.role == Role.ADMIN) {
      throw new HttpException(
        'You are not the owner, you cannot modify it.',
        HttpStatus.FORBIDDEN,
      );
    }
    const oldFilename = oldNft.imageName;
    try {
      const res = await this.prismaService.nft.update({
        data: {
          name: nft.name,
          price: Number(nft.price),
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

  async updateStatusNft(useEmail: string, id: number, nftStatus: Status) {
    const nft = await this.getNFT(id);
    if (nft === null) {
      throw new HttpException('Nft not found', HttpStatus.NOT_FOUND);
    }

    const user = await this.prismaService.user.findUnique({
      where: {
        email: useEmail,
      },
    });

    if (nft.userId !== user.id && user.role !== Role.ADMIN) {
      // Add admin role to let admin do the action
      throw new HttpException(
        "You cannot update a status of a nft if you aren't the author",
        HttpStatus.FORBIDDEN,
      );
    }

    try {
      await this.prismaService.nft.update({
        where: {
          id: id,
        },
        data: {
          status: nftStatus,
        },
      });
    } catch (e) {
      this.logger.error("Error updating NFT's status", e);
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
    let collection = null;
    if (nft.nftCollectionId != null) {
      collection = await this.prismaService.nftCollection.findUnique({
        where: {
          id: nft.nftCollectionId,
        },
      });
      if (user.teamId === collection.teamId && user.role !== Role.ADMIN) {
        throw new HttpException(
          "You can not rate your teammates' nft",
          HttpStatus.FORBIDDEN,
        );
      }
    }

    if (user.id === nft.userId && user.role !== Role.ADMIN) {
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
      const res = await this.prismaService.nft.update({
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

      let nbRates = 0;
      let sum = 0;

      if (collection !== null) {
        const collectionNfts = await this.prismaService.nft.findMany({
          where: {
            nftCollectionId: collection.id,
          },
        });
        collectionNfts.forEach((nft) => {
          if (nft.nbRates > 0) {
            nbRates++;
            sum += nft.rate;
          }
        });

        let result = -1;
        if (nbRates !== 0) {
          result = sum / nbRates;
        }

        await this.prismaService.nftCollection.update({
          where: {
            id: collection.id,
          },
          data: {
            rate: result,
          },
        });
      }

      return res;
    } catch (e) {
      this.logger.error('Error rating nft', e);
    }
  }
}
