import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('debtors')
export class Debtor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  companyName: string;

  @Column({ unique: true })
  cif: string;

  @Column('decimal', { precision: 10, scale: 2 })
  debtLimit: number;

  @Column()
  email: string;

  @Column({ type: 'date' })
  registrationDate: Date;

  @Column()
  contactPerson: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  mobile: string;

  @Column({
    type: 'enum',
    enum: ['EUR', 'USD', 'GBP'],
    default: 'EUR',
  })
  currency: string;

  @Column({ type: 'text', nullable: true })
  observations: string;

  @Column({
    type: 'enum',
    enum: ['ES', 'FR', 'DE', 'IT', 'PT', 'UK', 'US'],
    default: 'ES',
  })
  country: string;

  // IDs de usuario (sin relación porque está en otro microservicio)
  @Column()
  ownerUserId: string;

  @Column()
  createdByUserId: string;

  @Column({ nullable: true })
  updatedByUserId: string;

  // Fechas automáticas
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
