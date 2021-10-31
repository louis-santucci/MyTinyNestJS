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
    example: name
  })
  name: string;

  @ApiProperty({
    description: 'The owner of the NFT',
  })
  userId: number;

  @IsString()
  @ApiProperty({
    description: 'The imageName of the NFT',
  })
  imageName: string;

  @ApiProperty({
    description: 'The price of the NFT',
  })
  price: number;

  @ApiProperty({
    description: 'The status of the NFT',
  })
  status: Status;

  @ApiProperty({
    description: 'The history of the NFT',
  })
  history: string;

  @ApiProperty({
    description: 'The NFT Collection Id of the NFT',
  })
  nftCollectionId: number;

  @ApiProperty({
    description: 'The rate of the NFT',
  })
  rate: number;

  @ApiProperty({
    description: 'The number of rate of the NFT',
  })
  nbRates: number;
}
