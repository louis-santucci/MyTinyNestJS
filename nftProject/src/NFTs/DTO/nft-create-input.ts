import {IsNotEmpty, IsString} from 'class-validator';
import { ApiProperty, ApiBody } from '@nestjs/swagger';
import { Status} from '.prisma/client';

export class NFTCreateInput {
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
}