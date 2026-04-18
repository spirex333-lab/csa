import { useEffect, useState } from "react"
import { generateFingerprint, getUniqueId } from "../../core"

export const useUniqueId = () => {
    const [id, setId] = useState()
    useEffect(() => {
        const id_ = getUniqueId()
        setId(id_)
    }, [])

    return { id }
}

export const useFingerprint = (user?: any) => {
    const [fingerprint, setFingerprint] = useState<any>()
    useEffect(() => {
        generate()
    }, [])

    const generate = async () => {
        setFingerprint(await generateFingerprint(user))
    }

    return {
        fingerprint,
        generate
    }

}