import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('debtors')
export class Debtor {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  companyName: string; // nombre-deudor-empresa

  @Column({ unique: true })
  cif: string; // CIF-deudor

  @Column('decimal', { precision: 10, scale: 2 }) //precision: total de dígitos, scale: dígitos decimales
  debtLimit: number; // limite de deuda

  @Column()
  email: string; // Email_deudor

  @Column()
  registrationDate: string; // Fecha_alta_deudor

  @Column()
  contactPerson: string; // contacto-deudor

  @Column()
  phone: string; // telefono-deudor

  @Column({ nullable: true })
  mobile: string; // movil-deudor

  @Column({
    type: 'enum',
    enum: ['EUR', 'USD', 'GBP'],
    default: 'EUR',
  })
  currency: string; // moneda actual del deudor

  @Column({ type: 'text', nullable: true }) // el texto puede ser nulo, es decir, no obligatorio
  observations: string; // Observaciones-deudor
}
