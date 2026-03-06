import { PartialType } from '@nestjs/mapped-types';
import { CreateDebtorDto } from './create-debtor.dto';

// El debtor DTO sirve para actualizar los datos del debtor,
// se extiende del CreateDebtorDto y se hace parcial para que no sea necesario enviar todos los campos
export class UpdateDebtorDto extends PartialType(CreateDebtorDto) {}
