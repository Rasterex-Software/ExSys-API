import { Injectable } from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { QueryDocumentDto } from './dto/query-document.dto';
import { PaginateDto } from 'src/common/typeorm/dto/paginate.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Document } from './entities/document.entity';
import { Repository, DeepPartial } from 'typeorm';
import { DocumentVersion } from './entities/document.version.entity';
import { CreateDocumentVersionDto } from './dto/create-document-version.dto';

@Injectable()
export class DocumentsService {

  constructor(
    @InjectRepository(Document)
    private readonly repository: Repository<Document>,

    @InjectRepository(DocumentVersion)
    private readonly documentVersionRepository: Repository<DocumentVersion>,
  ) {
  }

  async list(query: QueryDocumentDto): Promise<PaginateDto<Document>> {
    const result = await this.repository.find({
      relations: {
        versions: true,
      },
      order: { id: query.order || 'ASC' },
      take: query.take || 9999,
      skip: query.skip || 0,
    });

    return {
      data: result,
      count: result.length,
    };
  }

  async create(document: CreateDocumentDto): Promise<Document> {
    return await this.repository.save(document);
  }

  async createDocumentVersion(version: DeepPartial<CreateDocumentVersionDto>): Promise<DocumentVersion> {
    const document = await this.repository.findOne({ where: { id: version.documentId } });

    const count = await this.documentVersionRepository.count({
      relations: ['document'],
      where: {
        document: {
          id: document.id
        }
      }
    });

    version.version = count + 1;

    console.log(version);

    return await this.documentVersionRepository.save({ ...version, document });
  }

  async findOne(id: number): Promise<Document> {
    return await this.repository.findOne({
      where: {
        id: id,
      },
      relations: {
        versions: true,
      },
    });
  }

  async update(id: number, updateDocumentDto: UpdateDocumentDto): Promise<any> {
    return await this.repository.update(id, updateDocumentDto);
  }

  async remove(id: number): Promise<void> {
    const document = await this.repository.findOne({
      where: {
        id: id,
      }
    });

    if (document) {
      await this.repository.remove(document);
    }
  }

  async findDocumentVersion(id: number): Promise<DocumentVersion> {
    return await this.documentVersionRepository.findOne({
      where: {
        id: id,
      }
    });
  }

  async removeDocumentVersion(id: number): Promise<void> {
    const version = await this.documentVersionRepository.findOne({
      where: {
        id: id,
      }
    });

    if (version) {
      await this.documentVersionRepository.remove(version);
    }
  }
}
