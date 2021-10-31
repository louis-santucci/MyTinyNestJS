import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class NftUpdateDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The name of the NFT',
    example: 'testNft'
  })
  name: string;

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

  @IsOptional()
  @IsNumberString()
  @ApiProperty({
    description: 'The collection Id of the NFT',
    example: 1
  })
  nftCollectionId: number;
}
