import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { validateAddress } from '@workspace/commons/validation/wallet-address';

export function IsValidWalletAddress(
  tickerPropertyOrValue: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidWalletAddress',
      target: (object as any).constructor,
      propertyName,
      constraints: [tickerPropertyOrValue],
      options: validationOptions,
      validator: {
        validate(value: unknown, args: ValidationArguments) {
          const [tickerOrProp] = args.constraints as [string];
          const obj = args.object as Record<string, unknown>;
          // If tickerOrProp is a property name on the DTO, read it dynamically
          const ticker = (obj[tickerOrProp] as string) ?? tickerOrProp;
          if (typeof value !== 'string' || typeof ticker !== 'string') return false;
          return validateAddress(ticker, value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} is not a valid wallet address for the selected coin`;
        },
      },
    });
  };
}
