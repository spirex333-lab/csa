import { createHash } from "crypto";

/**
 * Generates sha256 hash
 * @param value 
 * @returns 
 */
export const generateHash = (value: string) => {
    return createHash('sha256').update(value).digest('hex');
}