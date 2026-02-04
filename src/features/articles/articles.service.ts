import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';


@Injectable()
export class ArticlesService {
  constructor(private readonly prisma: PrismaService) {}

  // Method to create an article
  createArticleItem(createArticleDto: CreateArticleDto) {
    return this.prisma.articulo.create({
      data: {
        title: createArticleDto.title,
        description: createArticleDto.description,
      },
    });
  }

  // Method to get all articles
  getAllArticlesItems() {
    return this.prisma.articulo.findMany({
      include: {
        parteTrabajos: {
          select: {
            title: true,
          },
        },
      },
    });
  }

  // Method to get a articule by ID
  async getArticleItem(id: number) {
    const articleFound = await this.prisma.articulo.findFirst({
      where: {
        id,
      },
    });
    if (!articleFound) throw new HttpException('Article not found', 404);
    return articleFound;
  }
  // Method to update article
  async updateArticleItem(id: number, updateArticleDto: UpdateArticleDto) {
    const articleFound = await this.getArticleItem(id);
    if (!articleFound) throw new HttpException('Article not found', 404);
    const articleUpdated = this.prisma.articulo.update({
      where: {
        id: articleFound.id,
      },
      data: {
        title: updateArticleDto.title,
        description: updateArticleDto.description,
      },
    });
    return articleUpdated;
  }

  // Method to delete a article
  async deleteArticleItem(id: number) {
    try {
      const articleFound = await this.getArticleItem(id);
      if (!articleFound) throw new HttpException('Article not found', 404);

      return this.prisma.articulo.delete({
        where: {
          id: articleFound.id,
        },
      });
    } catch (err: unknown) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2003') {
          throw new ConflictException('The Field dont not exist in the table');
        }
        if (err.code === 'P2025') {
          throw new ConflictException('Record to delete does not exists');
        }
      }
    }
  }
}
