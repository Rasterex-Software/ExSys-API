import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateDocumentVersionDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: true,
  })
  file: any;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description: string;

  url?: string;
  documentId?: number;
  version?: number;
}