import { IsEnum, IsNotEmpty } from 'class-validator';
import { BaseDTO } from '../base.dto';
import { ListSchemaFieldTypes } from './list-schema-field.constants';

export class AudienceListSchemaFieldDTO extends BaseDTO<
  typeof AudienceListSchemaFieldDTO
> {
  @IsNotEmpty({ message: 'Please provide a valid field title' })
  public title!: string;
  
  @IsNotEmpty({ message: 'Please provide a valid field name' })
  public name!: string;

  @IsNotEmpty({ message: 'Please provide a valid field type' })
  @IsEnum(ListSchemaFieldTypes, { message: 'Should be one of the valid types' })
  public type!: string;

  public isActive!: boolean;
}
