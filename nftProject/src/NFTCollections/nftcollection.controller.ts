import { Controller, UseGuards, Request, Param, Post, Body, Get } from '@nestjs/common';
import { NftCollectionService } from './nftcollection.service';
import { ApiTags } from '@nestjs/swagger';
import { ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/Auth/jwt.auth.guard';
import { FindOneParams } from 'src/findOneParams';

@ApiTags('Nftcollection')
@Controller('nftcollection')
export class NftCollectionController {
    constructor(private readonly nftCollectionService: NftCollectionService) {}

    @Post('/')
    @ApiOperation({summary: 'Create a NftCollection'})
    @UseGuards(JwtAuthGuard)
    @ApiResponse({
        status: 200,
        description: "Create a NftCollection if the team does'nt have a NftCollection.",
        type: [String]
    })
    async createCollection(@Request() req, @Body() body) {
        return this.nftCollectionService.createCollection(req.user.email, body);
    }

    @Post('/addNft/:id')
    @ApiOperation({summary: 'Add a NFT to a NftCollection'})
    @UseGuards(JwtAuthGuard)
    @ApiResponse({
        status: 200,
        description: 'Add a NFT to a NftCollection',
        type: [Array]
    })
    async addNft(@Request() req, @Param() { id }: FindOneParams) {
        return this.nftCollectionService.addNft(req.user.email, id);
    }

    @Post('/deleteNft/:id')
    @ApiOperation({summary: 'Delete a NFT to a NftCollection'})
    @UseGuards(JwtAuthGuard)
    @ApiResponse({
        status: 200,
        description: 'Delete a NFT to a NftCollection',
        type: [Array]
    })
    async deleteNft(@Request() req, @Param() { id }: FindOneParams) {
        return this.nftCollectionService.deleteNft(req.user.email, id);
    }

    @Post('/update')
    @ApiOperation({summary: 'Update a NftCollection'})
    @UseGuards(JwtAuthGuard)
    @ApiResponse({
        status: 200,
        description: 'Update an existing NftCollection',
        type: [Array]
    })
    async updateCollection(@Request() req, @Body() body) {
        return this.nftCollectionService.updateCollection(req.user.email, body);
    }
}