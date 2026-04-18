import { ICategory } from "../categories"
import { IMedia } from "../media"

export type IColor = {
    id: string | number
    name: string
    hex: string
}
export type IStorage = {
    id: string | number
    name: string
    value: number
    unit: string
}

export type IMeta = {
    id: string | number
    name: string
    value: string
}

export type IFeature = {
    id: string | number
    name: string
    icon: IMedia
}

export type IProduct = {
    name: string
    slug: string
    color: IColor
    storage: IStorage
    price: number
    images: IMedia[]
    specifications: IMeta[]
    features: IFeature[]
    category: ICategory
    variants: IProduct[]
    description: string
}