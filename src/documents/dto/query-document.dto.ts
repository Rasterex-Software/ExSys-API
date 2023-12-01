import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/common/typeorm/dto/pagination-query.dto';

export class QueryDocumentDto extends PaginationQueryDto {

}
