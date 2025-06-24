import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/entity/user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(@Query() query: { limit?: number; skip?: number }) {
    return this.userService.findAll(query?.limit, query?.skip);
  }

  @Post()
  create(@Body() user: Partial<User>) {
    return this.userService.create(user);
  }

  @Patch(':id')
  upsert(@Param('id', ParseIntPipe) id: number, @Body() user: Partial<User>) {
    return this.userService.upsert(id, user);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.userService.delete(id);
  }
}
