import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  create(body: CreateCategoryDto) {
    return body;
  }

  findAll() {
    return `This action returns all categories`;
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, body: UpdateCategoryDto) {
    return `This action updates a #${body} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
