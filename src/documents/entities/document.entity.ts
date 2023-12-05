import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { DocumentVersion } from './document.version.entity';

@Entity('document')
export class Document {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty()
  @Column({ length: 1024, nullable: false })
  name: string;

  @ApiProperty()
  @Column({ length: 256, nullable: false })
  title: string;

  @ApiProperty()
  @Column({ nullable: false })
  url: string;

  @ApiProperty()
  @Column({ nullable: true })
  status: string;

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
  @OneToMany(() => DocumentVersion, (version) => version.document, { cascade: ['soft-remove'] })
  versions: DocumentVersion[];
}
