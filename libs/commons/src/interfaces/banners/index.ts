import { IMedia } from "../media"

export type IBanner = {
    placement?: string
    link?: string
    large?: IMedia
    medium?: IMedia
    small?: IMedia
    xsmall?: IMedia
}