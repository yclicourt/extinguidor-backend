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
import { FacturacionService } from './facturacion.service';
import { CreateFacturacionDto } from './dto/create-facturacion.dto';
import { UpdateFacturacionDto } from './dto/update-facturacion.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('factures')
@Controller('factures')
export class FacturacionController {
  constructor(private readonly facturacionService: FacturacionService) {}

  @Post()
  @ApiOperation({ summary: 'Create a facture' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  createFactureController(@Body() createFacturacionDto: CreateFacturacionDto) {
    return this.facturacionService.createFacturationItem(createFacturacionDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: 'Facture',
  })
  @ApiOperation({ summary: 'Get all factures' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  getAllFacturesController() {
    return this.facturacionService.getAllFacturationsItems();
  }
  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: 'Facture',
  })
  @ApiOperation({ summary: 'Get all factures' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  getTotalFacturesController(@Param(ParseIntPipe) id: number) {
    return this.facturacionService.getTotalFactureItems(id);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: 'Facture',
  })
  @ApiOperation({ summary: 'Get all factures' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  getFactureController(@Param('id') id: number) {
    return this.facturacionService.getFactureItem(id);
  }

  @Patch(':id')
  updateFactureController(
    @Param('id') id: number,
    @Body() updateFacturacionDto: UpdateFacturacionDto,
  ) {
    return this.facturacionService.updateFactureItem(id, updateFacturacionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a facture' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  deleteFactureController(@Param('id') id: number) {
    return this.facturacionService.deleteFactureItem(id);
  }
}
