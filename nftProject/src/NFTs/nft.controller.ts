import { Controller, Get, Query, Param } from '@nestjs/common';
import { NftService } from './nft.service';
import { ApiTags } from '@nestjs/swagger';
import { ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('nft')
@Controller('nft')
export class NftController {
    constructor(private readonly nftService: NftService) {}

    @Get('/add')
    @ApiOperation({summary: 'Nft'})
    @ApiResponse({
        status: 200,
        description: 'Nft',
        type: [Array]
    })
    addNft(): void {
        return this.nftService.addNft();
    }

    @Get('/update')
    @ApiOperation({summary: 'Nft'})
    @ApiResponse({
        status: 200,
        description: 'Nft',
        type: [Array]
    })
    updateNft(): void {
        return this.nftService.updateNft();
    }

    @Get('/rate')
    @ApiOperation({summary: 'Nft'})
    @ApiResponse({
        status: 200,
        description: 'Nft',
        type: [Array]
    })
    rateNft(): void {
        return this.nftService.rateNft();
    }
}