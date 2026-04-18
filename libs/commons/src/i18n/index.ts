import { proxy } from "valtio"
import en from "./langs/en"

export type TranslationOptions = {
    locale: string
    vars?: any
}

export type Translations = {
    [key: string]: any
}

export type I18N = {
    langs: Translations
}

export const I18N = proxy<TranslationOptions & I18N>({
    // export const I18N: any = {
    locale: "en",
    langs: {
        en
    }
    // }
})


export const addLangs = (languages: any) => {
    for (let k in languages) {
        I18N.langs[k] = {
            ...(I18N.langs[k] || {}),
            ...(languages[k] || {}),
        }
    }
}

export const translate = (key: string, opts: TranslationOptions = {
    locale: "en"
}) => {
    const { langs, locale } = I18N
    const translation = key.split(".").reduce((a: any, c: string) => a?.[c], langs[locale]) as string || key
    const { vars } = opts
    if (vars) {
        return translation.replace(/\${(.*?)}/g, (_, key) => vars[key])
    }
    return translation
}

export const t = (key: string, opts?: Partial<TranslationOptions>) => translate(key, { locale: I18N.locale, ...(opts || {}) })