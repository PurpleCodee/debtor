import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsNumber,
  IsPositive,
  IsOptional,
  Matches,
  Length,
  IsEnum,
  IsDateString,
} from 'class-validator';

export enum Currency {
  EUR = 'EUR',
  USD = 'USD',
  GBP = 'GBP',
}

export enum Country {
  ES = 'ES',
  FR = 'FR',
  DE = 'DE',
  IT = 'IT',
  PT = 'PT',
  UK = 'UK',
  US = 'US',
}

export class CreateDebtorDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 150)
  companyName: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-HJ-NP-SUVW]\d{7}[0-9A-J]$/, {
    message: 'El CIF no tiene un formato valido',
  })
  cif: string;

  @IsNumber()
  @IsPositive()
  debtLimit: number;

  @IsEmail()
  @IsNotEmpty()
  @Matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
    message: 'El email no tiene un formato valido',
  })
  email: string;

  @IsDateString()
  @IsNotEmpty()
  registrationDate: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  contactPerson: string;

  @Matches(/^[0-9]{9}$/, {
    message: 'El telefono debe tener 9 digitos',
  })
  phone: string;

  @IsOptional()
  @Matches(/^\+?[0-9]{9,15}$/, {
    message:
      'El movil debe tener entre 9 y 15 digitos, y puede incluir un prefijo de pais',
  })
  mobile?: string;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  observations?: string;

  @IsEnum(Country)
  country: Country;
}
