import { ApiProperty } from '@nestjs/swagger';
import { Status } from '.prisma/client';

export class NftCollectionResponse {
  @ApiProperty({
    description: 'The id of the NftCollection',
    example: 1
  })
  id: number;

  @ApiProperty({
    description: 'The name of a NftCollection',
    example: 'NftCollectionTest'
  })
  name: string;

  @ApiProperty({
    description: 'The name of a NftCollection',
    example: 'test.png'
  })
  imageName: string;

  @ApiProperty({
    description: 'The status of a NftCollection',
    example: Status.DRAFT
  })
  status: Status;

  @ApiProperty({
    description: 'The team id the NftCollection',
    example: 1
  })
  teamId: number;

  @ApiProperty({
    description: 'The rate id the NftCollection',
    example: 3
  })
  rate: number;
}
