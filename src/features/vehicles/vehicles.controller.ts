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
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateClientDto } from '../clients/dto/create-client.dto';

@ApiTags('vehicles')
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  @ApiOperation({ summary: 'Create vehicles' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBody({ type: CreateClientDto })
  createVehicleController(@Body() createVehicleDto: CreateVehicleDto) {
    return this.vehiclesService.createVehicleItem(createVehicleDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: 'Vehicle',
  })
  @ApiOperation({ summary: 'Get all vehicles' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  getAllVehiclesController() {
    return this.vehiclesService.getAllVehicleItems();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: 'Vehicle',
  })
  @ApiOperation({ summary: 'Get a vehicle' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  getVehicleController(@Param('id', ParseIntPipe) id: number) {
    return this.vehiclesService.getVehicleItem(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a vehicle' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  updateVehicleController(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVehicleDto: UpdateVehicleDto,
  ) {
    return this.vehiclesService.updateVehicleItem(id, updateVehicleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a vehicle' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  deleteVehicleController(@Param('id', ParseIntPipe) id: number) {
    return this.vehiclesService.deleteVehicleItem(id);
  }
}
