import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Status } from '.prisma/client';

export class NftCollectionUpdateDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The name of a NftCollection',
  })
  name: string;
}
