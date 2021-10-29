import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Status } from '.prisma/client';

export class NftUpdateStatusDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The status of a NFT',
  })
  status: Status;
}
