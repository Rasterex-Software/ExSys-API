import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginateDto } from 'src/common/typeorm/dto/paginate.dto';
import { User } from './entities/user.entity';
import { QueryUserDto } from './dto/query-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,) {
  }

  async list(query: QueryUserDto): Promise<PaginateDto<User>> {
    const result = await this.repository.find({
      order: { id: query.order || 'ASC' },
      take: query.take || 9999,
      skip: query.skip || 0,
    });

    return {
      data: result,
      count: result.length,
    };
  }
}
