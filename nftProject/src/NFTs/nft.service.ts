import {Injectable, Logger} from '@nestjs/common';
import {PrismaService} from "../Prisma/prisma.service";
import {JwtService} from "@nestjs/jwt";
import {NFTCreateDto} from "./DTO/nft-create.dto";
import {NFTUpdateDto} from "./DTO/nft-update.dto";
import {NFTCreateInput} from "./DTO/nft-create-input";
import {NFTRateInput} from "./DTO/nft-rate-input";

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

    async createNFT(body: NFTCreateInput, userEmail : string) {
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
                data: {
                    name: body.name,
                    userId: body.userId,
                    imagePath: "",
                    price: body.price,
                    status: body.status,
                    history: "" + body.userId,
                    rate: -1,
                    nbRates: 0
                }
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
        return await this.prismaService.nft.findFirst({
            where: {rate: { gt: -1}},
            orderBy: {
                rate: 'desc',
            }
        });
    }

    async getMostRatedNft() {
        return await this.prismaService.nft.findFirst({
            where: {nbRates: { gt: 0}},
            orderBy: {
                nbRates: 'desc',
            }
        });
    }

    async rateNft(idToRate: number, email: string, body: NFTRateInput) {
        try {
            var user = await this.prismaService.user.findUnique({
                where: {
                    email: email,
                },
            });

            var nft = await this.prismaService.nft.findUnique({
                where: {
                    id: Number(idToRate),
                },
            });

            if (nft.nftCollectionId != null){
                var collection = await this.prismaService.nftCollection.findUnique({
                    where: {
                        id: nft.nftCollectionId,
                    },
                });
                if (user.teamId === collection.teamId)
                {
                    return "You can not rate your teamates nft";
                }
            }

            if (user.id === nft.userId)
            {
                return "You can not rate your own nft";
            }

            var rateNumber = nft.nbRates + 1;
            if (rateNumber === 1){
                var newRate = body.rate;
            }
            else {
                var newRate = (nft.rate + body.rate) / rateNumber;
            }


            return await this.prismaService.nft.update({
                data: {
                    ...nft,
                    id: undefined,
                    rate: newRate,
                    nbRates: rateNumber
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