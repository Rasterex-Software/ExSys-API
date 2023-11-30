import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class PaginateDto<T> {
  @IsArray()
  @ApiProperty({ isArray: true })
  readonly data: T[];

  @ApiProperty()
  readonly count: number;
}
