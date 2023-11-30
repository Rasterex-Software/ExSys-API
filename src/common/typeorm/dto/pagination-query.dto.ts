import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class PaginationQueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  take?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  skip?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  order?: 'ASC' | 'DESC';
}
