import { ApiProperty, ApiBody } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SaleResponse {
  @ApiProperty({
    description: 'The id of the sale',
    example: 1
  })
  id: number;

  @IsNotEmpty()
  @ApiProperty({
    description: 'The id of the buyer',
    example: 1
  })
  buyerId: number;

  @IsNotEmpty()
  @ApiProperty({
    description: 'The id of the seller',
    example: 2
  })
  sellerId: number;

  @IsNotEmpty()
  @ApiProperty({
    description: 'The id of the NFT',
    example: 1
  })
  nftId: number;
}
