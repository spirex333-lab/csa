import { IMedia } from "../media"

export type IOffer = {
    id: string
    link: string
    large?: IMedia
    medium?: IMedia
    small?: IMedia
    xsmall?: IMedia
}