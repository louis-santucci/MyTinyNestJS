import { Controller, Get, Query, Param } from '@nestjs/common';
import { NftCollectionService } from './nftcollection.service';
import { ApiTags } from '@nestjs/swagger';
import { ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('nftcollection')
@Controller('nftcollection')
export class NftCollectionController {
    constructor(private readonly nftCollectionService: NftCollectionService) {}

    @Get('/create')
    @ApiOperation({summary: 'NftCollection'})
    @ApiResponse({
        status: 200,
        description: 'NftCollection',
        type: [Array]
    })
    createCollection(): void {
        return this.nftCollectionService.createCollection();
    }

    @Get('/add')
    @ApiOperation({summary: 'NftCollection'})
    @ApiResponse({
        status: 200,
        description: 'NftCollection',
        type: [Array]
    })
    addNft(): void {
        return this.nftCollectionService.addNft();
    }

    @Get('/delete')
    @ApiOperation({summary: 'NftCollection'})
    @ApiResponse({
        status: 200,
        description: 'NftCollection',
        type: [Array]
    })
    deleteNft(): void {
        return this.nftCollectionService.deleteNft();
    }

    @Get('/update')
    @ApiOperation({summary: 'NftCollection'})
    @ApiResponse({
        status: 200,
        description: 'NftCollection',
        type: [Array]
    })
    updateCollection(): void {
        return this.nftCollectionService.updateCollection();
    }
}