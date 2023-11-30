import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/common/typeorm/dto/pagination-query.dto';

export class QueryUserDto extends PaginationQueryDto {
  //@ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  //@ApiProperty({ required: false })
  @IsOptional()
  email?: string;
}
