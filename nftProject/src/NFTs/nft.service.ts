import {Injectable, Logger} from '@nestjs/common';
import {PrismaService} from "../Prisma/prisma.service";
import {JwtService} from "@nestjs/jwt";
import {NFTCreateDto} from "./DTO/nft-create.dto";
import {NFTUpdateDto} from "./DTO/nft-update.dto";

@Injectable()
export class NftService {
    constructor(
        private prismaService: PrismaService,
        private jwtService: JwtService,
    ) {}

    private readonly logger = new Logger(NftService.name);

    async getNFTs() {
        return this.prismaService.nft.findMany({
            where: {
                status: "PUBLISHED",
            }
        });
    }

    async createNFT(body: NFTCreateDto, userEmail : string) {
        try {
            var user = await this.prismaService.user.findUnique({
                where: {
                    email: userEmail,
                },
            });
            if (user.id != body.userId){
                return "Only the author of the NFT can create an NFT"
            }
            return this.prismaService.nft.create({
                data: body,
            });
        } catch (e) {
            this.logger.error('Error adding nft', e);
        }
    }

    async updateNft(id: number, nft: NFTUpdateDto, userEmail: string) {
        try {
            var user = await this.prismaService.user.findUnique({
                where: {
                    email: userEmail,
                },
            });
            if (user.id != nft.userId)
            {
                return "You are not the owner";
            }
            return await this.prismaService.nft.update({
                data: {
                    ...nft,
                    id: undefined,
                },
                where: {
                    id,
                },
            });
        } catch (e) {
            this.logger.error('Error updating nft', e);
        }
    }

    async getHighestRatedNft() {
        return await this.prismaService.nft.aggregate({
            where: {rate: { gt: -1}},
            orderBy: {
                rate: 'desc',
            },
            take: 1,
        });
    }

    async getMostRatedNft() {
        return await this.prismaService.nft.aggregate({
            where: {nbRates: { gt: 0}},
            orderBy: {
                nbRates: 'desc',
            },
            take: 1,
        });
    }
}