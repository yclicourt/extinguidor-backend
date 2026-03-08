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
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { PartesTrabajoService } from './partes_trabajo.service';
import { CreatePartesTrabajoDto } from './dto/create-partes_trabajo.dto';
import { UpdatePartesTrabajoDto } from './dto/update-partes_trabajo.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from 'src/common/file-upload/file-upload.service';

@ApiTags('partes-trabajo')
@Controller('partes-trabajo')
export class PartesTrabajoController {
  constructor(
    private readonly partesTrabajoService: PartesTrabajoService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create work part' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBody({ type: CreatePartesTrabajoDto })
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'imageDoc', maxCount: 1 },
        { name: 'docs', maxCount: 1 },
      ],
      {
        limits: {
          fileSize: 1024 * 1024 * 20,
        },
        fileFilter: (req, file, cb) => {
          if (file.fieldname === 'imageDoc') {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
              return cb(
                new Error('Only image files are allowed for imageDoc'),
                false,
              );
            }
          }
          if (file.fieldname === 'docs') {
            if (!file.originalname.match(/\.(pdf|docx|doc)$/)) {
              return cb(
                new Error('Only PDF or Word files are allowed for docs'),
                false,
              );
            }
          }
          cb(null, true);
        },
      },
    ),
  )
  async createParteTrabajoController(
    @UploadedFiles()
    files: { imageDoc?: Express.Multer.File[]; docs?: Express.Multer.File[] },
    @Body() createPartesTrabajoDto: CreatePartesTrabajoDto,
  ) {
    try {
      // 1. Manejo de la Imagen
      const imageFile = files.imageDoc?.[0];
      let imageUrl = createPartesTrabajoDto.imageDoc || 'unknown.png';

      if (imageFile) {
        const fileName = await this.fileUploadService.uploadFile(imageFile);
        imageUrl =
          process.env.NODE_ENV === 'production' && fileName.startsWith('http')
            ? fileName
            : `/uploads/${fileName}`;
      }

      // 2. Manejo del Documento (PDF/Docx)
      const docFile = files.docs?.[0];
      let docUrl = createPartesTrabajoDto.docs || '';

      if (docFile) {
        const docFileName = await this.fileUploadService.uploadFile(docFile);
        docUrl =
          process.env.NODE_ENV === 'production' &&
          docFileName.startsWith('http')
            ? docFileName
            : `/uploads/${docFileName}`;
      }

      // 3. Unir todo para el servicio
      const parteTrabajoData = {
        ...createPartesTrabajoDto,
        imageDoc: imageUrl,
        docs: docUrl,
      };

      return this.partesTrabajoService.createParteTrabajoItem(parteTrabajoData);
    } catch (error) {
      console.error('Error creating Work Part', error);
      throw error; // Es mejor relanzar el error para que Nest envíe un 500 al cliente
    }
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
  @Get('listado')
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: 'Work Part',
  })
  @ApiOperation({ summary: 'Get all Work Part' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  getParteTrabajoAssignOrUnssignController(
    @Query('month') month: string,
    @Query('year') year: string,
    @Query('assigned') assigned?: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '5',
  ) {
    const monthInt = parseInt(month);
    const yearInt = parseInt(year);
    const pageInt = parseInt(page);
    const limitInt = parseInt(limit);

    // Conversión del parámetro 'assigned' a booleano
    // Si no viene en la URL, podemos tratarlo como undefined para traer todo
    const isAssigned =
      assigned === 'true' ? true : assigned === 'false' ? false : undefined;
    return this.partesTrabajoService.getAssignORUnassignedParts(
      monthInt,
      yearInt,
      isAssigned,
      pageInt,
      limitInt,
    );
  }
  @Get('unassigned')
  @ApiOperation({
    summary: 'Obtener partes de trabajo no asignados a ninguna ruta',
  })
  @ApiResponse({ status: 200, description: 'Lista de partes sin ruta.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  getParteTrabajoUnssignController(
    @Query('month') month?: string,
    @Query('year') year?: string,
  ) {
    // Si no vienen parámetros, usamos el mes y año actual por defecto
    const now = new Date();
    const monthInt = month ? parseInt(month) : now.getMonth() + 1;
    const yearInt = year ? parseInt(year) : now.getFullYear();

    // Validación básica para evitar enviar NaN al servicio
    if (isNaN(monthInt) || isNaN(yearInt)) {
      throw new BadRequestException('Month and Year must be valid numbers');
    }

    return this.partesTrabajoService.getFindUnassigned(monthInt, yearInt);
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

  @Patch(':id/assign/:routeId')
  @ApiOperation({ summary: 'assign a part to route from calendar' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  assignPartToRouteController(
    @Param('id', ParseIntPipe) id: number,
    @Param('routeId', ParseIntPipe) routeId: number,
  ) {
    return this.partesTrabajoService.asignPartToRoute(routeId, id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a work part' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  deleteParteTrabajoController(@Param('id', ParseIntPipe) id: number) {
    return this.partesTrabajoService.deleteParteTrabajoItem(id);
  }
}
