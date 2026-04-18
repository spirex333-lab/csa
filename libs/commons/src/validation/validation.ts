import { validate } from "class-validator"
import { plainToInstance } from "class-transformer"

/**
 * Validates the given object using the given class.
 * @param Class 
 * @param dto 
 * @returns 
 */
export const validateDTO = async (Class: any, dto: any) => {
    return transformErrors(await validate(plainToInstance(Class, dto)))
}

/**
 * Transforms the given validation errors.
 * @param errors 
 * @returns 
 */
export const transformErrors = (errors: any = []) => {
    return errors.map((e: any) => ({
        property: e.property,
        errors: Object.values(e.constraints),
    }))
}