import {IsNotEmpty, IsString} from 'class-validator';
import { ApiProperty, ApiBody } from '@nestjs/swagger';
import { Status} from '.prisma/client';

export class NFTUpdateDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: 'The name of the NFT',
    })
    name : string;

    @IsNotEmpty()
    @ApiProperty({
        description: 'The owner of the NFT',
    })
    userId : number;

    @IsNotEmpty()
    @ApiProperty({
        description: 'The price of the NFT',
    })
    price : number;

    @IsNotEmpty()
    @ApiProperty({
        description: 'The status of the NFT',
    })
    status : Status;

    @IsString()
    @ApiProperty({
        description: 'The history of owners',
    })
    history : string;

    @ApiProperty({
        description: 'The collection Id of the NFT',
    })
    nftCollectionId : number;

    @ApiProperty({
        description: 'The rate of the NFT',
    })
    rate : number;

    @ApiProperty({
        description: 'The number of rates of the NFT',
    })
    nbRates : number;
}