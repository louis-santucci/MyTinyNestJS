import { ApiProperty } from '@nestjs/swagger';

export class TeamResponse {
  @ApiProperty({
    description: 'The id of the team',
    example: 1
  })
  id: number;

  @ApiProperty({
    description: 'The name of the team',
    example: 'testTeam'
  })
  name: string;

  @ApiProperty({
    description: 'The email of the leader of the team',
    example: 'test@test.com'
  })
  leaderEmail: string;

  @ApiProperty({
    description: 'The email of the leader of the team',
    example: 500
  })
  balance: number;
}
