import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { BaseDTO } from '../base.dto';
import { AudienceListSchemaFieldDTO } from './list-schema-field.dto';

export class CreateAudienceListDTO extends BaseDTO<
  typeof CreateAudienceListDTO
> {
  @IsNotEmpty({ message: 'Please provide a valid name' })
  public name!: string;

  @Transform(({ value }) => JSON.parse(value))
  @IsNotEmpty({ message: 'Please provide a valid schema' })
  @ValidateNested({ each: true })
  @Type(() => AudienceListSchemaFieldDTO)
  public schema!: AudienceListSchemaFieldDTO[];

  public isActive!: boolean;
}
