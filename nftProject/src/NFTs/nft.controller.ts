import {Controller, Get, Query, Param, Post, Body, Put, UseGuards, Request} from '@nestjs/common';
import { NftService } from './nft.service';
import { ApiTags } from '@nestjs/swagger';
import { ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import {NFTCreateDto} from "./DTO/nft-create.dto";
import {NFTUpdateDto} from "./DTO/nft-update.dto";
import {FindOneParams} from "../findOneParams";
import {JwtAuthGuard} from "../Auth/jwt.auth.guard";
import {NFTCreateInput} from "./DTO/nft-create-input";
import {NFTRateInput} from "./DTO/nft-rate-input";

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
    async getNFTs() {
        return this.nftService.getNFTs();
    }

    @Post('/')
    @ApiOperation({summary: 'Add a NFT'})
    @UseGuards(JwtAuthGuard)
    @ApiResponse({
        status: 200,
        description: 'NFT added',
        type: [Array]
    })
    async createNFT(@Body() body : NFTCreateInput, @Request() req) {
        return this.nftService.createNFT(body, req.user.email);
    }

    @Put('/:id')
    @ApiOperation({summary: 'Update NFT'})
    @UseGuards(JwtAuthGuard)
    @ApiResponse({
        status: 200,
        description: 'NFT updated',
        type: [Array]
    })
    async updateNft(@Request() req,
                    @Param() { id }: FindOneParams,
                    @Body() nft: NFTUpdateDto) {
        return this.nftService.updateNft(Number(id), nft, req.user.email);
    }

    @Get('/highestrate')
    @ApiOperation({summary: 'Get highest rated NFT'})
    @ApiResponse({
        status: 200,
        description: 'Highest rated NFT',
        type: [Array]
    })
    async getHighestRatedNft() {
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

    @Post('/rate/:id')
    @ApiOperation({summary: 'Rate a NFT'})
    @UseGuards(JwtAuthGuard)
    @ApiResponse({
        status: 200,
        description: 'Rate NFT',
        type: [Array]
    })
    async rateNft(@Param() { id }: FindOneParams, @Request() req, @Body() body : NFTRateInput) {
        return this.nftService.rateNft(id, req.user.email, body);
    }
}