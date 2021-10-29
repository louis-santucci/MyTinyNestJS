import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Status } from '.prisma/client';

export class NftCollectionUpdateStatusDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The status of a NftCollection',
  })
  status: Status;
}
