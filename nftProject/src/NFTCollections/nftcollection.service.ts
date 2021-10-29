import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../Prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { NftCollectionDto } from './DTO/nft-collection.dto';
import { Status, Role } from '.prisma/client';
import { NftCollectionUpdateDto } from './DTO/nft-collection.update.dto';

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

    if (user.teamId === null && user.role !== Role.ADMIN) {
      throw new HttpException(
        "You can not create a NFT Collection, you don't have a team.",
        HttpStatus.FORBIDDEN,
      );
    }

    try {
      return this.prismaService.nftCollection.create({
        data: {
          name: body.name,
          imageName: filename,
          status: body.status,
          teamId: user.teamId,
          rate: 0,
        },
      });
    } catch (e) {
      this.logger.error('Error creating a NFTCollection', e);
    }
  }

  async addNft(collectionId: number, useEmail: string, nftId: number) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: useEmail,
      },
    });

    if (user.teamId === null && user.role !== Role.ADMIN) {
      throw new HttpException(
        "You can not add a NFT to a NFT Collection, you don't have a team.",
        HttpStatus.FORBIDDEN,
      );
    }
    let nftCollection;
    if (user.role !== Role.ADMIN) {
      nftCollection = await this.prismaService.nftCollection.findFirst({
        where: {
          id: collectionId,
          teamId: user.teamId,
        },
      });

      if (nftCollection === null) {
        throw new HttpException(
          'Your team needs a NFT Collection to add a NFT in it.',
          HttpStatus.FORBIDDEN,
        );
      }
    } else {
      nftCollection = await this.prismaService.nftCollection.findFirst({
        where: {
          id: collectionId,
        },
      });
      if (nftCollection === null) {
        throw new HttpException('Unknown collection', HttpStatus.NOT_FOUND);
      }
    }

    try {
      await this.prismaService.nft.update({
        where: {
          id: Number(nftId),
        },
        data: {
          nftCollectionId: nftCollection.id,
          status: nftCollection.status,
        },
      });

      const newRate = await this.rate(nftCollection.id);

      return await this.prismaService.nftCollection.update({
        where: {
          id: nftCollection.id,
        },
        data: {
          rate: newRate,
        },
      });
    } catch (e) {
      this.logger.error('Error Adding a NFT to NFTCollection', e);
    }
  }

  async deleteNft(collectionId: number, useEmail: string, nftId: number) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: useEmail,
      },
    });

    if (user.teamId === null && user.role !== Role.ADMIN) {
      throw new HttpException(
        "You can not delete a NFT of a NFT Collection, you don't have a team.",
        HttpStatus.FORBIDDEN,
      );
    }

    let nftCollection;
    if (user.role !== Role.ADMIN) {
      nftCollection = await this.prismaService.nftCollection.findFirst({
        where: {
          id: collectionId,
          teamId: user.teamId,
        },
      });

      if (nftCollection === null) {
        throw new HttpException(
          'Your team needs a NFT Collection to add a NFT in it.',
          HttpStatus.FORBIDDEN,
        );
      }
    } else {
      nftCollection = await this.prismaService.nftCollection.findFirst({
        where: {
          id: collectionId,
        },
      });
      if (nftCollection === null) {
        throw new HttpException('Unknown collection', HttpStatus.NOT_FOUND);
      }
    }

    try {
      await this.prismaService.nft.update({
        where: {
          id: Number(nftId),
        },
        data: {
          nftCollectionId: null,
        },
      });

      const newRate = await this.rate(nftCollection.id);
      return await this.prismaService.nftCollection.update({
        where: {
          id: nftCollection.id,
        },
        data: {
          rate: newRate,
        },
      });
    } catch (e) {
      this.logger.error('Error Delete a NFT to NFTCollection', e);
    }
  }

  async updateNfts(id: number, collectionStatus: Status) {
    const nfts = await this.prismaService.nft.findMany({
      where: {
        nftCollectionId: id,
      },
    });

    if (nfts === null || nfts.length === 0) {
      return;
    }

    try {
      for (let i = 0; i < nfts.length; i++) {
        await this.prismaService.nft.update({
          where: {
            id: nfts[i].id,
          },
          data: {
            status: collectionStatus,
          },
        });
      }
    } catch (e) {
      this.logger.error("Error updating NFTs' status", e);
    }
  }

  async updateCollection(
    collectionId: number,
    useEmail: string,
    body: NftCollectionUpdateDto,
    filename: string,
  ) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: useEmail,
      },
    });

    if (user.teamId === null && user.role !== Role.ADMIN) {
      throw new HttpException(
        "You can not update a NFT Collection, you don't have a team.",
        HttpStatus.FORBIDDEN,
      );
    }

    let nftCollection;
    if (user.role !== Role.ADMIN) {
      nftCollection = await this.prismaService.nftCollection.findFirst({
        where: {
          id: collectionId,
          teamId: user.teamId,
        },
      });

      if (nftCollection === null) {
        throw new HttpException(
          'Your team needs a NFT Collection to add a NFT in it.',
          HttpStatus.FORBIDDEN,
        );
      }
    } else {
      nftCollection = await this.prismaService.nftCollection.findFirst({
        where: {
          id: collectionId,
        },
      });
      if (nftCollection === null) {
        throw new HttpException('Unknown collection', HttpStatus.NOT_FOUND);
      }
    }

    if (nftCollection.teamId !== null || user.role === Role.ADMIN) {
      try {
        return await this.prismaService.nftCollection.update({
          where: {
            id: nftCollection.id,
          },
          data: {
            name: body.name,
            imageName: filename,
          },
        });
      } catch (e) {
        this.logger.error('Error Update a NFTCollection', e);
      }
    }

    throw new HttpException(
      'You cannot update a collection which is not yours.',
      HttpStatus.FORBIDDEN,
    );
  }

  async updateStatusCollection(useEmail: string, id: number, status: Status) {
    const collection = await this.prismaService.nftCollection.findUnique({
      where: {
        id: id,
      },
    });

    if (collection === null) {
      throw new HttpException('Collection Id Not found', HttpStatus.NOT_FOUND);
    }

    collection.status = status;
    const user = await this.prismaService.user.findUnique({
      where: {
        email: useEmail,
      },
    });

    if (user.teamId === null && user.role !== Role.ADMIN) {
      // Add admin role to let admin do the action
      throw new HttpException(
        "You cannot publish a collection, you don't have any team",
        HttpStatus.FORBIDDEN,
      );
    }
    // Add admin role to let admin do the action
    if (
      collection.teamId &&
      user.teamId !== collection.teamId &&
      user.role !== Role.ADMIN
    ) {
      throw new HttpException(
        'You cannot publish a collection that is not from your team',
        HttpStatus.FORBIDDEN,
      );
    }
    await this.updateNfts(collection.id, collection.status);
    try {
      return this.prismaService.nftCollection.update({
        where: {
          id: collection.id,
        },
        data: {
          status: collection.status,
        },
      });
    } catch (e) {
      this.logger.error('Cannot update status of collection and its NFT', e);
    }
  }
}
