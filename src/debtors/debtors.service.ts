import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Country, Currency, CreateDebtorDto } from './dto/create-debtor.dto';
import { UpdateDebtorDto } from './dto/update-debtor.dto';
import { Debtor } from './entities/debtor.entity';

type CreateDebtorInput = CreateDebtorDto & {
  ownerUserId: string;
  createdByUserId: string;
};

type UpdateDebtorInput = UpdateDebtorDto & {
  updatedByUserId?: string;
};

type SortableDebtorField =
  | 'companyName'
  | 'cif'
  | 'email'
  | 'registrationDate';

type SortDirection = 'ASC' | 'DESC';

@Injectable()
export class DebtorsService {
  private readonly sortableFields: SortableDebtorField[] = [
    'companyName',
    'cif',
    'email',
    'registrationDate',
  ];

  constructor(
    @InjectRepository(Debtor)
    private readonly debtorRepository: Repository<Debtor>,
  ) {}

  private resolveCurrency(country: Country): Currency {
    switch (country) {
      case Country.UK:
        return Currency.GBP;
      case Country.US:
        return Currency.USD;
      case Country.ES:
      case Country.FR:
      case Country.DE:
      case Country.IT:
      case Country.PT:
      default:
        return Currency.EUR;
    }
  }

  async findOne(id: number, userId: string): Promise<Debtor> {
    const debtor = await this.debtorRepository.findOneBy({
      id,
      ownerUserId: userId,
    });

    if (!debtor) {
      throw new NotFoundException(`Debtor with ID ${id} not found`);
    }

    return debtor;
  }

  async create(createDebtorDto: CreateDebtorInput): Promise<Debtor> {
    const debtor = this.debtorRepository.create({
      ...createDebtorDto,
      currency: this.resolveCurrency(createDebtorDto.country),
    });

    return await this.debtorRepository.save(debtor);
  }

  async update(id: number, updateDebtorDto: UpdateDebtorInput): Promise<Debtor> {
    const existingDebtor = await this.debtorRepository.findOneBy({
      id,
      ownerUserId: updateDebtorDto.updatedByUserId,
    });

    if (!existingDebtor) {
      throw new NotFoundException(`Debtor with ID ${id} not found`);
    }

    const debtor = this.debtorRepository.merge(existingDebtor, {
      ...updateDebtorDto,
      ...(updateDebtorDto.country
        ? { currency: this.resolveCurrency(updateDebtorDto.country as Country) }
        : {}),
    });

    return this.debtorRepository.save(debtor);
  }

  async findAllPaginated(
    userId: string,
    page: number = 1,
    limit: number = 10,
    search: string = '',
    orderParam: string = 'companyName',
    orderType: string = 'DESC',
  ) {
    page = Math.max(page, 1);
    limit = Math.min(limit, 50);

    const safeOrderParam = this.sortableFields.includes(
      orderParam as SortableDebtorField,
    )
      ? (orderParam as SortableDebtorField)
      : 'companyName';
    const safeOrderType: SortDirection =
      orderType?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const queryBuilder = this.debtorRepository.createQueryBuilder('debtor');
    queryBuilder.where('debtor.ownerUserId = :userId', { userId });

    if (search && search.trim() !== '') {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('debtor.companyName ILIKE :search', { search: `%${search}%` })
            .orWhere('debtor.cif ILIKE :search', { search: `%${search}%` })
            .orWhere('debtor.email ILIKE :search', { search: `%${search}%` });
        }),
      );
    }

    queryBuilder.orderBy(`debtor.${safeOrderParam}`, safeOrderType);
    queryBuilder.addOrderBy('debtor.id', 'DESC');

    const [data, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
      orderParam: safeOrderParam,
      orderType: safeOrderType,
    };
  }
}
