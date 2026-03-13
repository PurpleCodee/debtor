import { Controller, Get, Post, Patch, Body, Param, ParseIntPipe, Query } from '@nestjs/common';
import { DebtorsService } from './debtors.service';
import { CreateDebtorDto } from './dto/create-debtor.dto';
import { UpdateDebtorDto } from './dto/update-debtor.dto';
import { Debtor } from './entities/debtor.entity';

@Controller('debtors')
export class DebtorsController {
  constructor(private readonly debtorsService: DebtorsService) {}

  @Get('search')
  async findAllPaginated(
    @Query('userId') userId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search: string = '',
  ) {
    return await this.debtorsService.findAllPaginated(
      userId,
      Number(page),
      Number(limit),
      search,
    );
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('userId') userId: string,
  ): Promise<Debtor> {
    return await this.debtorsService.findOne(id, userId);
  }

  @Post()
  async create(@Body() createDebtorDto: CreateDebtorDto): Promise<Debtor> {
    return await this.debtorsService.create(createDebtorDto as any);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDebtorDto: UpdateDebtorDto,
  ): Promise<Debtor> {
    return await this.debtorsService.update(id, updateDebtorDto as any);
  }
}
