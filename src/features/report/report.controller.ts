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
import { ReportService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('report')
@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  @ApiOperation({ summary: 'Create report' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBody({ type: CreateReportDto })
  createReportController(@Body() createReportDto: CreateReportDto) {
    return this.reportService.createReportItem(createReportDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: 'Report',
  })
  @ApiOperation({ summary: 'Get all Report' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  getReportsAllController() {
    return this.reportService.getReportAllItems();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: 'Report',
  })
  @ApiOperation({ summary: 'Get all Report' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  getReportController(@Param('id', ParseIntPipe) id: number) {
    return this.reportService.getReportItem(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a report' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  updateReportController(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReportDto: UpdateReportDto,
  ) {
    return this.reportService.updateReportItem(id, updateReportDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a report' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  deleteReportController(@Param('id', ParseIntPipe) id: number) {
    return this.reportService.deleteReportItem(id);
  }
}
