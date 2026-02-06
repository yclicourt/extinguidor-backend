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
import { PartesTrabajoService } from './partes_trabajo.service';
import { CreatePartesTrabajoDto } from './dto/create-partes_trabajo.dto';
import { UpdatePartesTrabajoDto } from './dto/update-partes_trabajo.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('partes-trabajo')
@Controller('partes-trabajo')
export class PartesTrabajoController {
  constructor(private readonly partesTrabajoService: PartesTrabajoService) {}

  @Post()
  @ApiOperation({ summary: 'Create work part' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBody({ type: CreatePartesTrabajoDto })
  createParteTrabajoController(
    @Body() createPartesTrabajoDto: CreatePartesTrabajoDto,
  ) {
    return this.partesTrabajoService.createParteTrabajoItem(
      createPartesTrabajoDto,
    );
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: 'Work Part',
  })
  @ApiOperation({ summary: 'Get all Work Part' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  getAllParteTrabajoController() {
    return this.partesTrabajoService.getAllParteTrabajoItems();
  }
  @Get('count-pending')
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: 'Work Part',
  })
  @ApiOperation({ summary: 'Get all Work Part' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  getTotalParteTrabajoPendingController() {
    return this.partesTrabajoService.getDashboardWorkOrderStats();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: 'Work Part',
  })
  @ApiOperation({ summary: 'Get a work part' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  getParteTrabajoController(@Param('id', ParseIntPipe) id: number) {
    return this.partesTrabajoService.getParteTrabajoItem(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a work part' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  updateParteTrabajoController(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePartesTrabajoDto: UpdatePartesTrabajoDto,
  ) {
    return this.partesTrabajoService.updateParteTrabajoItem(
      id,
      updatePartesTrabajoDto,
    );
  }

  @Patch('calendars')
  @ApiOperation({ summary: 'Assign parts to route from calendar' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  assignPartsToRouteController(
    @Param('routeId', ParseIntPipe) routeId: number,
    @Param('partIds', ParseIntPipe) partIds: number[],
  ) {
    return this.partesTrabajoService.asignPartsToRoute(routeId, partIds);
  }

  @Patch('calendar')
  @ApiOperation({ summary: 'assign a part to route from calendar' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  assignPartToRouteController(
    @Param('routeId', ParseIntPipe) routeId: number,
    @Param('partIds', ParseIntPipe) partId: number,
  ) {
    return this.partesTrabajoService.asignPartToRoute(routeId, partId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a work part' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  deleteParteTrabajoController(@Param('id', ParseIntPipe) id: number) {
    return this.partesTrabajoService.deleteParteTrabajoItem(id);
  }
}
