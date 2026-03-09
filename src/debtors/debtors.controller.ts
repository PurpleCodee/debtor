import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe, Query } from '@nestjs/common';
import { DebtorsService } from './debtors.service';
import { CreateDebtorDto } from './dto/create-debtor.dto';
import { UpdateDebtorDto } from './dto/update-debtor.dto';
import { Debtor } from './entities/debtor.entity';

@Controller('debtors') // Ruta base
export class DebtorsController {
  constructor(private readonly debtorsService: DebtorsService) {}

  @Get(':id') // GET /debtors/:id -> obtener un deudor por ID
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Debtor> {
    return await this.debtorsService.findOne(id);
  }

  @Post() // POST /debtors -> crear
  async create(@Body() createDebtorDto: CreateDebtorDto): Promise<Debtor> {
    return await this.debtorsService.create(createDebtorDto);
  }

  @Patch(':id') // PATCH /debtors/:id -> actualizar
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDebtorDto: UpdateDebtorDto,
  ): Promise<Debtor> {
    return await this.debtorsService.update(id, updateDebtorDto);
  }

  // Endpoint para búsqueda con paginación
  @Get('search') // GET /debtors/search -> búsqueda con paginación
  async findAllPaginated(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search: string = '',
  ) {
    return await this.debtorsService.findAllPaginated(
      Number(page),
      Number(limit),
      search,
    );
  }
}
