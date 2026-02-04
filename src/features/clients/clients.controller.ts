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
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('clients')
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @ApiOperation({ summary: 'Create clients' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBody({ type: CreateClientDto })
  createClientController(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.createClientItem(createClientDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: 'Client',
  })
  @ApiOperation({ summary: 'Get all clients' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  getAllClientController() {
    return this.clientsService.getAllClientsItems();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: 'Client',
  })
  @ApiOperation({ summary: 'Get a client' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  getRouteController(@Param('id', ParseIntPipe) id: number) {
    return this.clientsService.getClientItem(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a client' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  updateRouteController(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateClientDto: UpdateClientDto,
  ) {
    return this.clientsService.updateClientItem(id, updateClientDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a client' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  deleteRouteController(@Param('id', ParseIntPipe) id: number) {
    return this.clientsService.deleteClientItem(id);
  }
}
