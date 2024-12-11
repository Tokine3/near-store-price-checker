import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserNameDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Headers('uid') uid: string, @Body() body: CreateUserDto) {
    return this.usersService.create(uid, body);
  }

  @Get('me')
  me(@Headers('uid') uid: string) {
    return this.usersService.findMe(uid);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch('login')
  login(@Headers('uid') uid: string) {
    return this.usersService.login(uid);
  }

  @Patch(':id')
  updateName(@Headers('uid') uid: string, @Body() body: UpdateUserNameDto) {
    return this.usersService.update(uid, body);
  }

  @Delete(':id')
  remove(@Param('uid') uid: string) {
    return this.usersService.remove(uid);
  }
}
