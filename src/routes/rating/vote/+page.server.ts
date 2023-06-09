import prisma from '$lib/server/prisma.js'
import type { RatingVoteFemaleSearch, RatingVoteLoad, RatingVoteMaleSearch, ServerResponse, Student } from '$lib/types.js'


export const load = async ({ cookies }): ServerResponse<RatingVoteLoad> => {

  const codeString = cookies.get("code")
  if (!codeString) return { success: false, error: { reason: "unauthorized" } }

  return { success: true, data: {} }

}

export const actions = {

  maleSearch: async ({ request }): ServerResponse<RatingVoteMaleSearch> => {

    try {

      const data = await request.formData()
      const maleQuery = data.get("m")

      if (!maleQuery || maleQuery.toString().length < 1) return { success: false, error: { reason: "missing", fields: ["m"] } }
      if (maleQuery.toString().length < 3) return { success: false, error: { reason: "invalid", fields: [{ field: "m", details: "too short" }] } }

      const searchQuery = "*" + maleQuery.toString() + "*"

      const maleResult = await prisma.maleStudent.findMany({ where: { fullName: { search: searchQuery } } })
      return { success: true, data: { results: maleResult as Student[] } }

    } catch (error) {
      
      console.error(error)
      return { success: false, error: { reason: "internalError" } }

    }

  },

  femaleSearch: async ({ request }): ServerResponse<RatingVoteFemaleSearch> => {

    try {

      const data = await request.formData()
      const femaleQuery = data.get("m")

      if (!femaleQuery || femaleQuery.toString().length) return { success: false, error: { reason: "missing", fields: ["m"] } }
      if (femaleQuery.toString().length < 3) return { success: false, error: { reason: "invalid", fields: [{ field: "m", details: "too short" }] } }

      const searchQuery = "*" + femaleQuery.toString() + "*"

      const femaleResult = await prisma.maleStudent.findMany({ where: { fullName: { search: searchQuery } } })
      return { success: true, data: { results: femaleResult } }

    } catch (error) {
      
      console.error(error)
      return { success: false, error: { reason: "internalError" } }

    }

  },

  vote: async () => {



  }

}