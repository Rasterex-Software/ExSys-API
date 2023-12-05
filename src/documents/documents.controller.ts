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
import { DocumentVersion } from './entities/document.version.entity';
import { AwsService } from 'src/common/typeorm/aws.service';
import { UpdateDocumentVersionDto } from './dto/update-document-version.dto';

@Controller('documents')
export class DocumentsController {
  constructor(
    private readonly documentsService: DocumentsService,
    private readonly awsService: AwsService
  ) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: CreateDocumentDto,
  })
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile() file: any,
    @Body() document: CreateDocumentDto): Promise<Document> {
      const fileName = `${Date.now()}-${file.originalname}`;
      const s3Response: any = await this.awsService.uploadToS3(file.buffer, fileName);
      document.url = s3Response.Location;
      document.key = fileName;

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
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UpdateDocumentDto,
  })
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id') id: string,
    @UploadedFile() file: any,
    @Body() updateDocumentDto: UpdateDocumentDto,
    @Res() res: Response) {
      const document = await this.documentsService.findOne(+id);

      if (!document) {
        return res.status(HttpStatus.NOT_FOUND).send();
      }

      if (file) {
        if (document.key) {
          await this.awsService.removeFromS3(document.key);
        }

        const fileName = `${Date.now()}-${file.originalname}`;
        const s3Response: any = await this.awsService.uploadToS3(file.buffer, fileName);
        updateDocumentDto.url = s3Response.Location;
        updateDocumentDto.key = fileName;
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

    if (document?.key) {
      await this.awsService.removeFromS3(document.key);
    }

    if (document.versions?.length) {
      await Promise.all(document.versions.map(async (version) => {
        if (version.key) {
          await this.awsService.removeFromS3(version.key);
        }
      }));
    }

    return res.status(HttpStatus.OK).send({ messege: 'Document is successfully deleted.'});
  }

  /* versions */
  @Post(':id/versions')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: CreateDocumentVersionDto,
  })
  @UseInterceptors(FileInterceptor('file'))
  async createDocumentVersion(
    @Param('id') id: number,
    @UploadedFile() file: any,
    @Body() version: CreateDocumentVersionDto,
    @Res() res: Response): Promise<any> {
      const document = await this.documentsService.findOne(+id);

      if (!document) {
        return res.status(HttpStatus.NOT_FOUND).send({ message: 'Document not found.' });
      }

      version.documentId = id;

      const fileName = `${Date.now()}-${file.originalname}`;
      const s3Response: any = await this.awsService.uploadToS3(file.buffer, fileName);
      version.url = s3Response.Location;
      version.key = fileName;

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

    if (version?.key) {
      await this.awsService.removeFromS3(version.key);
    }

    return res.status(HttpStatus.OK).send({ messege: 'Version is successfully deleted.'});
  }

  @Patch('versions/:version')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UpdateDocumentVersionDto,
  })
  @UseInterceptors(FileInterceptor('file'))
  async updateVersion(
    @Param('version') versionId: string,
    @UploadedFile() file: any,
    @Body() updateVersionDto: UpdateDocumentVersionDto,
    @Res() res: Response) {
      const version = await this.documentsService.findDocumentVersion(+versionId);

      if (!version) {
        return res.status(HttpStatus.NOT_FOUND).send();
      }

      if (file) {
        if (version.key) {
          await this.awsService.removeFromS3(version.key);
        }

        const fileName = `${Date.now()}-${file.originalname}`;
        const s3Response: any = await this.awsService.uploadToS3(file.buffer, fileName);
        updateVersionDto.url = s3Response.Location;
        updateVersionDto.key = fileName;
      }

      await this.documentsService.updateDocumentVersion(+versionId, updateVersionDto);

      return res.status(HttpStatus.OK).send({ messege: 'Document version is successfully updated.'});
  }
}
