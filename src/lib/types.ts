import type { FemaleStudent, MaleStudent, SongRequest, User } from "@prisma/client"

export type Student = {
  id: number,
  fullName: string,
  firstName: string,
  lastName: string,
  totalVotes: number,
  votedUsers: User
}

export type ServerResponse<T> = Promise<
| { success: true, data: T }
| { success: false, error: ServerLoadError }>

export type ServerLoadError =

| { reason: "missing", fields: string[] }
| { reason: "invalid", fields: { field: string, details: string }[] }
| { reason: "unauthorized", details?: string }
| { reason: "forbidden", details?: string }
| { reason: "notFound", details?: string }
| { reason: "internalError", details?: string }

export type RootLoad = {
  male: MaleStudent[],
  female: FemaleStudent[]
}

export type LoginAction = {
  redirect: string,
  userName: string
}

export type RatingLoad =
| {
  page: number,
  queryType: StudentQueryType,
  students: Student[]
}

export type RatingVoteLoad = {}

export type RatingVoteMaleSearch = { results: MaleStudent[] }

export type RatingVoteFemaleSearch = { results: FemaleStudent[] }

export type RatingVoteSubmit = {}

export type SongsLoad = {
  page: number
  songs: SongRequest[]
}

export type SongsVote = {}

export type SongsVoteLoad = {}

export type SongsVoteSearch = { results: SpotifyTrack[] }

export type SongsVoteSubmit = {}

export type StudentQueryType = "all" | "maleOnly" | "femaleOnly"

export type Auth0User = {
  sub: string
  name: string
  email: string
}

export type SpotifyTrack = {

  id: string
  is_playable: boolean
  is_local: boolean

  name: string
  album: {
    name: string
    images: {
      url: string
    }[]
  }
  artists: {
    name: string
  }[]
  external_urls: {
    spotify: string
  }


}