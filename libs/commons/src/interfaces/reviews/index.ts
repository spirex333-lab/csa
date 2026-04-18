import { IMedia } from "../media"
import { IUser } from "../user"

export type IReview = {
    title: string
    comment: string
    fullName: string
    avatar: IMedia
    rating: number
    slug: string    // Indicates what entity is this review attached to
}