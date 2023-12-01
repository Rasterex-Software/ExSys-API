import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Query
} from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { QueryDocumentDto } from './dto/query-document.dto';
import { PaginateDto } from 'src/common/typeorm/dto/paginate.dto';
import { Document } from './entities/document.entity';
import { CreateDocumentVersionDto } from './dto/create-document-version.dto';
import { DocumentVersion } from './entities/document.version.entity';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: CreateDocumentDto,
  })
  @UseInterceptors(FileInterceptor('file'))
  create(
    @UploadedFile() file: any,
    @Body() document: CreateDocumentDto): Promise<Document> {
      document.url = "http://";
    return this.documentsService.create(document);
  }

  @Get()
  list(@Query() query: QueryDocumentDto): Promise<PaginateDto<Document>> {
    return this.documentsService.list(query);
  }

/*   @Get(':id')
  findOne(@Param('id') id: string): Promise<Document> {
    return this.documentsService.findOne(+id);
  } */

/*  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDocumentDto: UpdateDocumentDto) {
    return this.documentsService.update(+id, updateDocumentDto);
  } */

 /*  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.documentsService.remove(+id);
  } */

  @Post(':id/versions')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: CreateDocumentVersionDto,
  })
  @UseInterceptors(FileInterceptor('file'))
  createDocumentVersion(
    @Param('id') id: number,
    @UploadedFile() file: any,
    @Body() version: CreateDocumentVersionDto): Promise<DocumentVersion> {
      version.documentId = id;
      version.url = "http://";
    return this.documentsService.createDocumentVersion(version);
  }
}
