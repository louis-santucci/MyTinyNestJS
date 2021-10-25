import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from "../Prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { NftCollectionDTO } from './DTO/nftcollection.dto';
import { SSL_OP_NETSCAPE_REUSE_CIPHER_CHANGE_BUG } from 'constants';

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

        var sum = 0;
        for (var i = 0; i < nfts.length; i++) {
            sum += nfts[i].rate;
        }
        
        return sum / nfts.length;
    }

    async createCollection(useEmail: string, body: NftCollectionDTO) {
        try {
            const user = await this.prismaService.user.findUnique({
                where: {
                    email: useEmail,
                },
            });

            if (user.teamId === null) {
                return "You can not create a NFT Collection, you don't have a team."
            }

            const collection = await this.prismaService.nftCollection.findUnique({
                where: {
                    teamId: user.teamId,
                },
            });

            if (collection === null) {
                await this.prismaService.nftCollection.create({
                    data: {
                        name: body.name,
                        logo: body.logo,
                        status: body.status,
                        teamId: user.teamId,
                        rate: 0,
                    },
                });

                return "Your Collection has been created."
            }

            return "Your Team already have a NFT Collection."
        } catch (e) {
            this.logger.error('Error creating a NFTCollection', e);
        }
    }

    async addNft(useEmail: string, nftId: number) {
        try {
            const user = await this.prismaService.user.findUnique({
                where: {
                    email: useEmail,
                },
            });

            if (user.teamId === null) {
                return "You can not add a NFT to a NFT Collection, you don't have a team."
            }

            const nftCollection = await this.prismaService.nftCollection.findUnique({
                where: {
                    teamId: user.teamId,
                },
            });

            if (nftCollection === null) {
                return "Your team needs a NFT Collection to add a NFT.";
            }

            await this.prismaService.nft.update({
                where: {
                    id: Number(nftId)
                },
                data: {
                    nftCollectionId: nftCollection.id,
                },
            });

            const newRate = await this.rate(nftCollection.id);
            await this.prismaService.nftCollection.update({
                where: {
                    id: nftCollection.id
                },
                data: {
                    rate: newRate,
                },
            });

            return "The NFT has been added."
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
                return "You can not delete a NFT of a NFT Collection, you don't have a team."
            }

            const nftCollection = await this.prismaService.nftCollection.findUnique({
                where: {
                    teamId: user.teamId,
                },
            });

            if (nftCollection === null) {
                return "Your team needs a NFT Collection to delete a NFT.";
            }

            await this.prismaService.nft.update({
                where: {
                    id: Number(nftId)
                },
                data: {
                    nftCollectionId: null,
                },
            });

            const newRate = await this.rate(nftCollection.id);
            await this.prismaService.nftCollection.update({
                where: {
                    id: nftCollection.id
                },
                data: {
                    rate: newRate,
                },
            });

            return "The NFT has been deleted."
        } catch (e) {
            this.logger.error('Error Delete a NFT to NFTCollection', e);
        }
    }

    async updateCollection(useEmail: string, body: NftCollectionDTO) {
        try {
            const user = await this.prismaService.user.findUnique({
                where: {
                    email: useEmail,
                },
            });

            if (user.teamId === null) {
                return "You can not update a NFT Collection, you don't have a team."
            }

            const collection = await this.prismaService.nftCollection.findUnique({
                where: {
                    teamId: user.teamId,
                },
            });

            if (collection.teamId !== null) {
                await this.prismaService.nftCollection.update({
                    where: {
                        id: collection.id
                    },
                    data: {
                        name: body.name,
                        logo: body.logo,
                        status: body.status,
                    },
                });

                return "Your Collection has been updated."
            }

            return "Your team needs a NFT Collection before updating."
        } catch (e) {
            this.logger.error('Error Update a NFTCollection', e);
        }
    }
}