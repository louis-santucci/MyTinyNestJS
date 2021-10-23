import {Controller, Get, Query, Param, Post, Body, Put} from '@nestjs/common';
import { NftService } from './nft.service';
import { ApiTags } from '@nestjs/swagger';
import { ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import {NFTCreateDto} from "./DTO/nft-create.dto";
import {NFTUpdateDto} from "./DTO/nft-update.dto";
import {FindOneParams} from "../findOneParams";

@ApiTags('nft')
@Controller('nft')
export class NftController {
    constructor(private readonly nftService: NftService) {}

    @Get('/')
    @ApiOperation({summary: 'Get all NFT'})
    @ApiResponse({
        status: 200,
        description: 'The list of all NFT',
        type: [Array],
    })
    async getSales() {
        return this.nftService.getNFTs();
    }

    @Post('/')
    @ApiOperation({summary: 'Add a NFT'})
    @ApiResponse({
        status: 200,
        description: 'NFT added',
        type: [Array]
    })
    async createSale(@Body() body : NFTCreateDto) {
        return this.nftService.createNFT(body);
    }

    @Put('/:id')
    @ApiOperation({summary: 'Update NFT'})
    @ApiResponse({
        status: 200,
        description: 'NFT updated',
        type: [Array]
    })
    async updateNft(@Param() { id }: FindOneParams,
                    @Body() nft: NFTUpdateDto) {
        return this.nftService.updateNft(Number(id), nft);
    }

    @Get('/highestrate')
    @ApiOperation({summary: 'Get highest rated NFT'})
    @ApiResponse({
        status: 200,
        description: 'Highest rated NFT',
        type: [Array]
    })
    async getRateNft() {
        return this.nftService.getHighestRatedNft();
    }

    @Get('/mostrated')
    @ApiOperation({summary: 'Get most rated NFT'})
    @ApiResponse({
        status: 200,
        description: 'Most rated NFT',
        type: [Array]
    })
    async getMostRatedNft() {
        return this.nftService.getMostRatedNft();
    }
}