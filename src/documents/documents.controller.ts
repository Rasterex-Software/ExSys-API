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
  Query,
  Res,
  HttpStatus
} from '@nestjs/common';
import { Response } from 'express';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { QueryDocumentDto } from './dto/query-document.dto';
import { PaginateDto } from 'src/common/typeorm/dto/paginate.dto';
import { Document } from './entities/document.entity';
import { CreateDocumentVersionDto } from './dto/create-document-version.dto';
import { UpdateDocumentVersionDto } from './dto/update-document-version.dto';

@Controller('documents')
export class DocumentsController {
  constructor(
    private readonly documentsService: DocumentsService,
  ) {}

  @Post()
  @ApiBody({
    type: CreateDocumentDto,
  })
  async create(
    @Body() document: CreateDocumentDto): Promise<Document> {
      return this.documentsService.create(document);
  }

  @Get()
  list(@Query() query: QueryDocumentDto): Promise<PaginateDto<Document>> {
    return this.documentsService.list(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response): Promise<any> {
    const document = await this.documentsService.findOne(+id);

    if (!document) {
      return res.status(HttpStatus.NOT_FOUND).send();
    }

    return res.status(HttpStatus.OK).send(document);
  }

  @Patch(':id')
  @ApiBody({
    type: UpdateDocumentDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateDocumentDto: UpdateDocumentDto,
    @Res() res: Response) {
      const document = await this.documentsService.findOne(+id);

      if (!document) {
        return res.status(HttpStatus.NOT_FOUND).send();
      }

      await this.documentsService.update(+id, updateDocumentDto);

      return res.status(HttpStatus.OK).send({ messege: 'Document is successfully updated.'});
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response): Promise<any> {
    const document = await this.documentsService.findOne(+id);

    if (!document) {
      return res.status(HttpStatus.NOT_FOUND).send();
    }

    await this.documentsService.remove(+id);

    return res.status(HttpStatus.OK).send({ messege: 'Document is successfully deleted.'});
  }

  /* versions */
  @Post(':id/versions')
  @ApiBody({
    type: CreateDocumentVersionDto,
  })
  async createDocumentVersion(
    @Param('id') id: number,
    @Body() version: CreateDocumentVersionDto,
    @Res() res: Response): Promise<any> {
      const document = await this.documentsService.findOne(+id);

      if (!document) {
        return res.status(HttpStatus.NOT_FOUND).send({ message: 'Document not found.' });
      }

      version.documentId = id;
      const result = await this.documentsService.createDocumentVersion(version);

      return res.status(HttpStatus.OK).send(result);
  }

  @Delete('versions/:version')
  async removeVersion(@Param('version') versionId: string, @Res() res: Response): Promise<any> {
    const version = await this.documentsService.findDocumentVersion(+versionId);

    if (!version) {
      return res.status(HttpStatus.NOT_FOUND).send();
    }

    await this.documentsService.removeDocumentVersion(+versionId);

    return res.status(HttpStatus.OK).send({ messege: 'Version is successfully deleted.'});
  }

  @Patch('versions/:version')
  @ApiBody({
    type: UpdateDocumentVersionDto,
  })
  @UseInterceptors(FileInterceptor('file'))
  async updateVersion(
    @Param('version') versionId: string,
    @Body() updateVersionDto: UpdateDocumentVersionDto,
    @Res() res: Response) {
      const version = await this.documentsService.findDocumentVersion(+versionId);

      if (!version) {
        return res.status(HttpStatus.NOT_FOUND).send();
      }

      await this.documentsService.updateDocumentVersion(+versionId, updateVersionDto);

      return res.status(HttpStatus.OK).send({ messege: 'Document version is successfully updated.'});
  }
}
