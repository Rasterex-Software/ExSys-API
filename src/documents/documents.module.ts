import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from './entities/document.entity';
import { DocumentVersion } from './entities/document.version.entity';
import { AwsService } from 'src/common/typeorm/aws.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Document,
      DocumentVersion
    ]),
  ],
  controllers: [DocumentsController],
  providers: [DocumentsService, AwsService],
})
export class DocumentsModule {}
