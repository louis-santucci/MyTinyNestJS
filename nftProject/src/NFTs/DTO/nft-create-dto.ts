import { IsNotEmpty, IsNumberString, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Status } from '.prisma/client';

export class NftCreateDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The name of the NFT',
    example: 'testNft'
  })
  name: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'The owner of the NFT',
    example: 1
  })
  userId: number;

  @IsNumberString()
  @IsNotEmpty()
  @Matches(/^(?!-)/, {
    message: 'The price must be positive',
  })
  @ApiProperty({
    description: 'The price of the NFT',
    example: 100
  })
  price: number;
}
