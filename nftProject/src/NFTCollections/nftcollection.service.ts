import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../Prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { NftCollectionDto } from './DTO/nft-collection.dto';

@Injectable()
export class NftCollectionService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  private readonly logger = new Logger(NftCollectionService.name);

  async rate(id: number) {
    const nfts = await this.prismaService.nft.findMany({
      where: {
        nftCollectionId: id,
      },
    });

    if (nfts === null || nfts.length === 0) {
      return 0;
    }

    let sum = 0;
    for (let i = 0; i < nfts.length; i++) {
      sum += nfts[i].rate;
    }

    return sum / nfts.length;
  }

  // Get all NFT collections
  async getCollections(offset?: number, limit?: number) {
    // Offset/Limit checking
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
    return this.prismaService.nftCollection.findMany({
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

  async searchCollection(name: string, offset: number, limit: number) {
    const collections = await this.getCollections();
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

    if (collections === null) {
      return null;
    }
    const results = [];
    collections.forEach((collection) => {
      if (collection.name.toLowerCase().includes(name)) {
        results.push(collection);
      }
    });
    return results.slice(offset, limit + offset);
  }

  async getCollection(collectionId: number) {
    return this.prismaService.nftCollection.findUnique({
      where: {
        id: Number(collectionId),
      },
    });
  }

  async createCollection(
    useEmail: string,
    body: NftCollectionDto,
    filename: string,
  ) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: useEmail,
      },
    });

    if (user.teamId === null) {
      throw new HttpException(
        "You can not create a NFT Collection, you don't have a team.",
        HttpStatus.FORBIDDEN,
      );
    }

    const collection = await this.prismaService.nftCollection.findUnique({
      where: {
        teamId: user.teamId,
      },
    });

    if (collection !== null) {
      try {
        return this.prismaService.nftCollection.create({
          data: {
            name: body.name,
            logo: filename,
            status: body.status,
            teamId: user.teamId,
            rate: 0,
          },
        });
      } catch (e) {
        this.logger.error('Error creating a NFTCollection', e);
      }
    }
    throw new HttpException(
      'Your Team already have a NFT Collection.',
      HttpStatus.FORBIDDEN,
    );
  }

  async addNft(useEmail: string, nftId: number) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          email: useEmail,
        },
      });

      if (user.teamId === null) {
        return "You can not add a NFT to a NFT Collection, you don't have a team.";
      }

      const nftCollection = await this.prismaService.nftCollection.findUnique({
        where: {
          teamId: user.teamId,
        },
      });

      if (nftCollection === null) {
        return 'Your team needs a NFT Collection to add a NFT.';
      }

      await this.prismaService.nft.update({
        where: {
          id: Number(nftId),
        },
        data: {
          nftCollectionId: nftCollection.id,
        },
      });

      const newRate = await this.rate(nftCollection.id);
      await this.prismaService.nftCollection.update({
        where: {
          id: nftCollection.id,
        },
        data: {
          rate: newRate,
        },
      });

      return 'The NFT has been added.';
    } catch (e) {
      this.logger.error('Error Adding a NFT to NFTCollection', e);
    }
  }

  async deleteNft(useEmail: string, nftId: number) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          email: useEmail,
        },
      });

      if (user.teamId === null) {
        return "You can not delete a NFT of a NFT Collection, you don't have a team.";
      }

      const nftCollection = await this.prismaService.nftCollection.findUnique({
        where: {
          teamId: user.teamId,
        },
      });

      if (nftCollection === null) {
        return 'Your team needs a NFT Collection to delete a NFT.';
      }

      await this.prismaService.nft.update({
        where: {
          id: Number(nftId),
        },
        data: {
          nftCollectionId: null,
        },
      });

      const newRate = await this.rate(nftCollection.id);
      await this.prismaService.nftCollection.update({
        where: {
          id: nftCollection.id,
        },
        data: {
          rate: newRate,
        },
      });

      return 'The NFT has been deleted.';
    } catch (e) {
      this.logger.error('Error Delete a NFT to NFTCollection', e);
    }
  }

  async updateCollection(
    useEmail: string,
    body: NftCollectionDto,
    filename: string,
  ) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: useEmail,
      },
    });

    if (user.teamId === null) {
      throw new HttpException(
        "You can not create a NFT Collection, you don't have a team.",
        HttpStatus.FORBIDDEN,
      );
    }

    const collection = await this.prismaService.nftCollection.findUnique({
      where: {
        teamId: user.teamId,
      },
    });

    if (collection.teamId !== null) {
      try {
        return this.prismaService.nftCollection.update({
          where: {
            id: collection.id,
          },
          data: {
            name: body.name,
            logo: filename,
            status: body.status,
          },
        });
      } catch (e) {
        this.logger.error('Error Update a NFTCollection', e);
      }
    }

    throw new HttpException(
      'Your team needs a NFT Collection before updating.',
      HttpStatus.FORBIDDEN,
    );
  }
}
