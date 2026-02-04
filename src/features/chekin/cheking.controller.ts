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
import { ChekinService } from './cheking.service';
import { CreateChekingDto } from './dto/create-cheking.dto';
import { UpdateChekinDto } from './dto/update-cheking.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('checking')
@Controller('cheking')
export class ChekinController {
  constructor(private readonly chekinService: ChekinService) {}

  @Post()
  @ApiOperation({ summary: 'Create checking' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBody({ type: CreateChekingDto })
  createCheckingController(@Body() createChekinDto: CreateChekingDto) {
    return this.chekinService.createCheckinItem(createChekinDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: 'Checking',
  })
  @ApiOperation({ summary: 'Get all checkings' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  getAllCheckingsController() {
    return this.chekinService.getAllCheckingsItems();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: 'Checking',
  })
  @ApiOperation({ summary: 'Get a checking' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  getCheckingController(@Param('id', ParseIntPipe) id: number) {
    return this.chekinService.getCheckingItem(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a checking' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  updateCheckingController(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateChekinDto: UpdateChekinDto,
  ) {
    return this.chekinService.updateCheckingItem(id, updateChekinDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a checking' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  deleteCheckingController(@Param('id', ParseIntPipe) id: number) {
    return this.chekinService.deleteCheckingItem(id);
  }
}
