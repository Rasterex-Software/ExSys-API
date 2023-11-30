import { Controller, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { PaginateDto } from 'src/common/typeorm/dto/paginate.dto';
import { User } from './entities/user.entity';
import { QueryUserDto } from './dto/query-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  private list(@Query() query: QueryUserDto): Promise<PaginateDto<User>> {
    return this.usersService.list(query);
  }
}
