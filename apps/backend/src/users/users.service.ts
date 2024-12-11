import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateUserNameDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  create(uid: string, body: CreateUserDto) {
    const { email, name } = body;

    return this.prisma.user.create({
      data: {
        userId: uid,
        email,
        name,
        lastLoggedInAt: new Date(),
      },
    });
  }

  login(uid: string) {
    console.log('uid:', uid);
    if (!uid) {
      throw new BadRequestException('uid が指定されていません');
    }

    return this.prisma.user.update({
      where: {
        userId: uid,
      },
      data: {
        lastLoggedInAt: new Date(),
      },
    });
  }

  findMe(uid: string) {
    console.log('findMe uid:', uid);
    return this.prisma.user.findUnique({
      where: {
        userId: uid,
      },
    });
  }

  updateName(uid: string, body: UpdateUserNameDto) {
    const { name } = body;
    return this.prisma.user.update({
      where: {
        userId: uid,
      },
      data: {
        name,
      },
    });
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(uid: string, body: UpdateUserNameDto) {
    const { name } = body;
    return this.prisma.user.update({
      where: {
        userId: uid,
      },
      data: {
        name,
      },
    });
  }

  remove(uid: string) {
    return this.prisma.user.delete({
      where: {
        userId: uid,
      },
    });
  }
}
