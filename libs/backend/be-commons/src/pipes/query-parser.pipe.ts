import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class QueryParserPipe implements PipeTransform {
  transform(value: unknown, { type }: ArgumentMetadata) {
    if (type !== 'query') return value;
    if (!value || typeof value !== 'object') {
      return value;
    }
    const parsed = this.convertStringValuesToTypes(value as never);
    return parsed;
  }

  private convertStringValuesToTypes(
    input: Record<string, unknown>
  ): Record<string, unknown> {
    const output: Record<string, unknown> = {};

    for (const key in input) {
      const value = input[key];

      if (typeof value === 'string') {
        if (value === 'true') {
          output[key] = true;
        } else if (value === 'false') {
          output[key] = false;
        } else if (!isNaN(Number(value)) && value.trim() !== '') {
          output[key] = Number(value);
        } else if (
          typeof value === 'string' &&
          value.startsWith('{') &&
          value.endsWith('}')
        ) {
          output[key] = this.convertStringValuesToTypes(JSON.parse(value));
        } else if (
          typeof value === 'string' &&
          value.startsWith('[') &&
          value.endsWith(']')
        ) {
          output[key] = this.convertStringValuesToTypes(JSON.parse(value));
        } else {
          output[key] = decodeURIComponent(value);
        }
      } else if (Object.keys(value as never).length) {
        output[key] = this.convertStringValuesToTypes(value as never);
      }
    }
    return output;
  }
}
