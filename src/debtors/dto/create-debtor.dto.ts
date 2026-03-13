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

// Exporto un enum para las monedas permitidas, esto facilita la validación y el mantenimiento del código
export enum Currency {
  EUR = 'EUR', // Euro
  USD = 'USD', // Dólar estadounidense
  GBP = 'GBP', //libra
}
// Paises permitidos
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
  // El nombre de la empresa es un string, no puede estar vacío y debe tener entre 2 y 150 caracteres
  @IsString()
  @IsNotEmpty()
  @Length(2, 150)
  companyName: string;

  // El CIF es un string, no puede estar vacío y debe seguir el formato específico
  // de CIF español (letra seguida de 7 dígitos y un dígito o letra de control)
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-HJ-NP-SUVW]\d{7}[0-9A-J]$/, {
    message: 'El CIF no tiene un formato válido',
  })
  cif: string;

  // El límite de deuda es un número, debe ser positivo y se almacena como decimal
  @IsNumber()
  @IsPositive()
  debtLimit: number;

  // El email es un string, debe ser un correo electrónico válido y no puede estar vacío se valida
  // con una expresión regular para asegurar un formato correcto
  @IsEmail()
  @IsNotEmpty()
  @Matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
    message: 'El email no tiene un formato válido',
  })
  email: string;

  // La fecha de registro es una cadena que representa una fecha,
  // debe ser una fecha válida en formato ISO 8601 (YYYY-MM-DD) y no puede estar vacía
  @IsDateString()
  @IsNotEmpty()
  registrationDate: string;

  // La persona de contacto es un string, no puede estar vacío y debe tener entre 2 y 100 caracteres
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  contactPerson: string;

  // teléfono fijo obligatorio, debe tener 9 dígitos y se valida con una expresión regular
  @Matches(/^[0-9]{9}$/, {
    message: 'El teléfono debe tener 9 dígitos',
  })
  phone: string;

  // móvil opcional, debe tener 9 dígitos y se valida con una expresión regular y numero de pais
  @IsOptional()
  @Matches(/^\+?[0-9]{9,15}$/, {
    message:
      'El móvil debe tener entre 9 y 15 dígitos, y puede incluir un prefijo de país',
  })
  mobile?: string;

  // La moneda es un valor del enum Currency, lo que garantiza que solo se acepten las monedas permitidas
  @IsEnum(Currency)
  currency: Currency;

  // Las observaciones son un string opcional, con una longitud máxima de 500 caracteres
  @IsOptional()
  @IsString()
  @Length(0, 500)
  observations?: string;

  // Validacion del pais
  @IsEnum(Country)
  country: Country;

  @IsString()
  @IsNotEmpty()
  ownerUserId: string;

  @IsString()
  @IsNotEmpty()
  createdByUserId: string;
}
