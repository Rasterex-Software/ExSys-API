import { ConfigService } from '@nestjs/config';
import { Injectable, Inject } from '@nestjs/common';
import { S3Client, DeleteObjectCommand  } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { Readable } from 'stream';

@Injectable()
export class AwsService {
  constructor(
    @Inject(ConfigService)
    private readonly config: ConfigService,
  ) {}

  private readonly AWS_REGION = this.config.get<string>('AWS_REGION');
  private readonly AWS_S3_BUCKET_NAME = this.config.get<string>('AWS_S3_BUCKET_NAME');
  private readonly AWS_S3_ACCESS_KEY_ID = this.config.get<string>('AWS_S3_ACCESS_KEY_ID');
  private readonly AWS_S3_SECRET_ACCESS_KEY = this.config.get<string>('AWS_S3_SECRET_ACCESS_KEY');

  public async uploadToS3(fileBuffer: Buffer, fileName: string): Promise<any> {
    const upload = new Upload({
      client: new S3Client({
        region: this.AWS_REGION,
        credentials: {
          accessKeyId: this.AWS_S3_ACCESS_KEY_ID,
          secretAccessKey: this.AWS_S3_SECRET_ACCESS_KEY
        }
      }),
      params: {
        Bucket: this.AWS_S3_BUCKET_NAME,
        Key: fileName,
        Body: Readable.from(fileBuffer)
      }
    });

    return upload.done();
  }

  public async removeFromS3(key: string): Promise<void> {
    const client= new S3Client({
      region: this.AWS_REGION,
      credentials: {
        accessKeyId: this.AWS_S3_ACCESS_KEY_ID,
        secretAccessKey: this.AWS_S3_SECRET_ACCESS_KEY
      }
    });

    await client.send(new DeleteObjectCommand( { Bucket: this.AWS_S3_BUCKET_NAME, Key: key }));
  }
}
