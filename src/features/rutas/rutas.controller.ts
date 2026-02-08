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
  getAllRouteController() {
    return this.rutasService.getAllRoutesItems();
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
