import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('articles')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @ApiOperation({ summary: 'Create articles' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBody({ type: CreateArticleDto })
  createArticleController(@Body() createArticleDto: CreateArticleDto) {
    return this.articlesService.createArticleItem(createArticleDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: 'Article',
  })
  @ApiOperation({ summary: 'Get all articles' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  getAllArticlesController() {
    return this.articlesService.getAllArticlesItems();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: 'Article',
  })
  @ApiOperation({ summary: 'Get a article' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  getArticleController(@Param('id', ParseIntPipe) id: number) {
    return this.articlesService.getArticleItem(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a article' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  updateArticleController(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    return this.articlesService.updateArticleItem(id, updateArticleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a client' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  deleteArticleController(@Param('id', ParseIntPipe) id: number) {
    return this.articlesService.deleteArticleItem(id);
  }
}
