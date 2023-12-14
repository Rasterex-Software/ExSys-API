import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateDocumentVersionDto {
  @ApiProperty({ required: true })
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description: string;

  documentId?: number;
  version?: number;
}