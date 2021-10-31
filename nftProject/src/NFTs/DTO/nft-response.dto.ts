import { IsNotEmpty, IsNumberString, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Status } from '.prisma/client';

export class NftResponse {
  @ApiProperty({
    description: 'The id of the NFT',
    example: 1
  })
  id: number;

  @IsString()
  @ApiProperty({
    description: 'The name of the NFT',
    example: 'testNft'
  })
  name: string;

  @ApiProperty({
    description: 'The owner of the NFT',
    example: 1
  })
  userId: number;

  @IsString()
  @ApiProperty({
    description: 'The imageName of the NFT',
    example: 'test.png'
  })
  imageName: string;

  @ApiProperty({
    description: 'The price of the NFT',
    example: 100
  })
  price: number;

  @ApiProperty({
    description: 'The status of the NFT',
    example: Status.DRAFT
  })
  status: Status;

  @ApiProperty({
    description: 'The history of the NFT',
    example: "2"
  })
  history: string;

  @ApiProperty({
    description: 'The NFT Collection Id of the NFT',
    example: 1
  })
  nftCollectionId: number;

  @ApiProperty({
    description: 'The rate of the NFT',
    example: 5
  })
  rate: number;

  @ApiProperty({
    description: 'The number of rate of the NFT',
    example: 1
  })
  nbRates: number;
}
