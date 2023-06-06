import type { FemaleStudent, MaleStudent, User } from "@prisma/client"

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

| { reason: "missing", field: string }
| { reason: "invalid", field: string, details: string }
| { reason: "unauthorized", details?: string }
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
  queryType: "all" | "maleOnly" | "femaleOnly",
  students: Student[]
}