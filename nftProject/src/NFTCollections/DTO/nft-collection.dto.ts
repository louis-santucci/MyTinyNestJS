import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Status } from '.prisma/client';

export class NftCollectionDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The name of a NftCollection',
    example: 'NftCollectionTest'
  })
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The status of a NftCollection',
    example: Status.DRAFT
  })
  status: Status;
}
