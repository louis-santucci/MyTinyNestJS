import { ApiProperty, ApiBody } from '@nestjs/swagger';
import {IsNotEmpty} from "class-validator";

export class SaleCreateDto {
    @IsNotEmpty()
    @ApiProperty({
        description: 'The id of the buyer',
    })
    buyerId : number;

    @IsNotEmpty()
    @ApiProperty({
        description: 'The id of the seller',
    })
    sellerId : number;

    @IsNotEmpty()
    @ApiProperty({
        description: 'The id of the NFT',
    })
    nftId : number;
}