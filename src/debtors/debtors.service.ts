import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Debtor } from './entities/debtor.entity';
import { CreateDebtorDto } from './dto/create-debtor.dto';
import { UpdateDebtorDto } from './dto/update-debtor.dto';

@Injectable()
export class DebtorsService {

  constructor(
    // Repository sirve para interactuar con la base de datos, en este caso con la entidad Debtor
    @InjectRepository(Debtor)
    private readonly debtorRepository: Repository<Debtor>,
  ) {}

  // Metodo para traer todoa la informacion de un deudor por su id
  async findOne(id: number): Promise<Debtor> {
    const debtor = await this.debtorRepository.findOneBy({ id });
    if (!debtor) {
      throw new NotFoundException(`Debtor with ID ${id} not found`);
    }
    return debtor;
  }

  // ------Metodo para crear un nuevo deudor------
  async create(createDebtorDto: CreateDebtorDto): Promise<Debtor> {
    const debtor = this.debtorRepository.create(createDebtorDto); // crea la instancia
    return await this.debtorRepository.save(debtor); // inserta o actualiza en la base de datos
  }

  // ------Metodo para actualizar un deudor existente------
  async update(id: number, updateDebtorDto: UpdateDebtorDto): Promise<Debtor> {
    // preload busca el deudor por ID y actualiza solo los campos proporcionados en el DTO
    const debtor = await this.debtorRepository.preload({
      id,
      // spread operator para actualizar solo los campos proporcionados en el DTO
      ...updateDebtorDto,
    });
    // Si no se encuentra el deudor, lanzar una excepción
    if (!debtor) {
      throw new NotFoundException(`Debtor with ID ${id} not found`);
    }

    return this.debtorRepository.save(debtor);
  }

  // ------Metodo para busqueda por coindicencias y paginacion------
  async findAllPaginated(
  page: number = 1,
  limit: number = 10,
  search: string = '',
) {
  page = Math.max(page, 1); // Asegura que la página sea al menos 1
  limit = Math.min(limit, 50); // Limita el número máximo de resultados por página a 50

  // Una query builder es una forma de construir consultas SQL de manera programática, en este caso para la entidad Debtor
  const queryBuilder = this.debtorRepository.createQueryBuilder('debtor');

  if (search && search.trim() !== '') {
    queryBuilder.andWhere(
      // Brackets permite agrupar condiciones en la consulta, en este caso para buscar coincidencias en varios campos
      new Brackets((qb) => {
        qb.where('debtor.companyName ILIKE :search', { search: `%${search}%` })
          .orWhere('debtor.cif ILIKE :search', { search: `%${search}%` })
          .orWhere('debtor.email ILIKE :search', { search: `%${search}%` })
      }),
    );
  }
  // Ordena los resultados por ID en orden descendente para mostrar los deudores más recientes primero
  queryBuilder.orderBy('debtor.id', 'DESC');

  const [data, total] = await queryBuilder
    .skip((page - 1) * limit) // Calcula el número de registros a omitir para la paginación
    .take(limit) // Limita el número de registros a devolver según el parámetro limit
    .getManyAndCount(); // Ejecuta la consulta y devuelve los resultados junto con el conteo total de registros que coinciden con la búsqueda

  return {
    data,
    total,
    page,
    lastPage: Math.ceil(total / limit),// Calcula el número total de páginas basado en el total de registros y el límite por página
  };
}
}
