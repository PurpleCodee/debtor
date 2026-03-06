import { Module } from '@nestjs/common';
import { DebtorsService } from './debtors.service';
import { DebtorsController } from './debtors.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Debtor } from './entities/debtor.entity';

@Module({
  controllers: [DebtorsController],
  providers: [DebtorsService],
  exports: [DebtorsService], 
  // Exporta el servicio para que pueda ser utilizado en otros módulos
  // Es necesario importar el módulo de TypeORM para que NestJS
  // pueda manejar la entidad Debtor y realizar operaciones en la base de datos
  imports: [TypeOrmModule.forFeature([Debtor])],
})
export class DebtorsModule {}
