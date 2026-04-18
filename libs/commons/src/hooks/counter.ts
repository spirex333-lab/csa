import { useCallback, useState } from "react"

export type UseCounterOpts = {
    length?: number,
    min?: number
}

export const useCounter = (val: number, {
    min = 0,
    length
}: UseCounterOpts) => {
    const [value, setValue] = useState(val ?? 0)
    const increment = () => {
        if (length && length > min) {
            if (value >= length-1) {
                setValue(min)
                return;
            }
        }
        if (length && length > 1)
            setValue(value + 1)
    }

    const decrement = () => {
        if (length && length > 1 && length > min) {
            if (value <= min) {
                setValue(length-1)
                return;
            }
        }
        if (length && length > 1)
            setValue(value - 1)
    }

    return {
        value,
        setValue,
        increment,
        decrement
    }
}