import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    RelationId
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from './document.entity';

@Entity('document_version')
export class DocumentVersion {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty()
  @Column({ nullable: false })
  url: string;

  @ApiProperty()
  @Column()
  description: string;

  @ApiProperty()
  @Column({ nullable: false })
  version: number;

  @Column({ length: 1024, nullable: true })
  key: string;

  /*
  * Create and Update Date Columns
  */
  @ApiProperty()
  @CreateDateColumn({ nullable: false })
  createdDate!: Date;

  @ApiProperty()
  @UpdateDateColumn({ nullable: true })
  modifiedDate!: Date;

  @ApiProperty()
  @Column({ type: 'int', nullable: true })
  lastModifiedUserId: number;

  /*
  * Relations
  */
  @RelationId('document')
  documentId: number;

  @ApiProperty()
  @ManyToOne(() => Document, (document) => document.versions, { onDelete: 'CASCADE' })
  document: Document;
}
