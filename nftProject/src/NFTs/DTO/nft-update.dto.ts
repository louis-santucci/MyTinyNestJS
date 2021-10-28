import {
    IsNotEmpty,
    IsNumber,
    IsNumberString, IsOptional,
    IsPositive,
    isString,
    IsString,
    Matches,
    Min,
} from 'class-validator';
import { ApiProperty, ApiBody } from '@nestjs/swagger';
import { Status } from '.prisma/client';

export class NftUpdateDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The name of the NFT',
  })
  name: string;

  @IsNumberString()
  @IsNotEmpty()
  @Matches(/^(?!-)/, {
    message: 'The price must be positive',
  })
  @ApiProperty({
    description: 'The price of the NFT',
  })
  price: number;

  @IsNotEmpty()
  @ApiProperty({
    description: 'The status of the NFT',
  })
  status: Status;

  @IsOptional()
  @IsNumberString()
  @ApiProperty({
    description: 'The collection Id of the NFT',
  })
  nftCollectionId: number;
}
