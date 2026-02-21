import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { RutasService } from './rutas.service';
import { CreateRutaDto } from './dto/create-ruta.dto';
import { UpdateRutaDto } from './dto/update-ruta.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('rutas')
@Controller('rutas')
export class RutasController {
  constructor(private readonly rutasService: RutasService) {}

  @Post()
  @ApiOperation({ summary: 'Create route' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBody({ type: CreateRutaDto })
  createRouteController(@Body() createRutaDto: CreateRutaDto) {
    return this.rutasService.createRouteItem(createRutaDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: 'Route',
  })
  @ApiOperation({ summary: 'Get all routes' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  getAllRouteController(
    @Query('limit') limit: string = '5',
    @Query('skip') skip: string = '0',
  ) {
    const limitInt = parseInt(limit);
    const skipInt = parseInt(skip);
    return this.rutasService.getAllRoutesItems(limitInt, skipInt);
  }
  @Get('stats')
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: 'Route',
  })
  @ApiOperation({ summary: 'Get all routes' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  getRouteStadisticsController() {
    return this.rutasService.getRouteStadistics();
  }

  @Get('count')
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: 'Route',
  })
  @ApiOperation({ summary: 'Get all routes' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  getTotalRoutesFinalizesController() {
    return this.rutasService.getTotalRoutesFinalize();
  }

  @Get('byMonth')
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: 'Route',
  })
  @ApiOperation({ summary: 'Get all routes' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  getTotalRoutesByMonthController(
    @Query('month') month?: string,
    @Query('year') year?: string,
  ) {
    const now = new Date();
    const monthInt = month ? parseInt(month) : now.getMonth() + 1;
    const yearInt = year ? parseInt(year) : now.getFullYear();

    // Validación básica para evitar enviar NaN al servicio
    if (isNaN(monthInt) || isNaN(yearInt)) {
      throw new BadRequestException('Month and Year must be valid numbers');
    }
    return this.rutasService.getTotalRoutesByMonthItems(monthInt, yearInt);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: 'Route',
  })
  @ApiOperation({ summary: 'Get a route' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  getRouteController(@Param('id', ParseIntPipe) id: number) {
    return this.rutasService.getRouteItem(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a route' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  updateRouteController(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRutaDto: UpdateRutaDto,
  ) {
    return this.rutasService.updateRouteItem(id, updateRutaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a route' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  deleteRouteController(@Param('id', ParseIntPipe) id: number) {
    return this.rutasService.deleteRouteItem(id);
  }
}
