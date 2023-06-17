import prisma from '$lib/server/prisma.js'
import type { Auth0User, RatingVoteFemaleSearch, RatingVoteLoad, RatingVoteMaleSearch, RatingVoteSubmit, ServerResponse, Student } from '$lib/types.js'
import auth0 from '$lib/server/auth0.js'
import type { Actions, PageServerLoad } from './$types';


export const load = (async ({ cookies }): ServerResponse<RatingVoteLoad> => {

  const token = cookies.get("token")
  if (!token) return { success: false, error: { reason: "unauthorized" } }

  try {
    const auth0User = await auth0.getProfile(token) as Auth0User
    let dbUser = await prisma.user.findUnique({ where: { sub: auth0User.sub } })

    if (!dbUser) {
      dbUser = await prisma.user.create({ data: {
        sub: auth0User.sub,
        name: auth0User.name,
        hasVoted: false }
      })
    }

    if (dbUser.hasVoted) return { success: false, error: { reason: "forbidden", details: "already voted" } }
    
    return { success: true, data: {} }

  }
  catch (error) {
    return { success: false, error: { reason: "unauthorized" } }
  }

}) satisfies PageServerLoad

export const actions = ({

  maleSearch: async ({ request }): ServerResponse<RatingVoteMaleSearch> => {

    try {

      const data = await request.formData()
      const maleQuery = data.get("m")

      if (!maleQuery || maleQuery.toString().trim().length < 1) return { success: false, error: { reason: "missing", fields: ["m"] } }
      if (maleQuery.toString().trim().length < 3) return { success: false, error: { reason: "invalid", fields: [{ field: "m", details: "too short" }] } }

      const searchQuery = "*" + maleQuery.toString() + "*"

      const maleResult = await prisma.maleStudent.findMany({ where: { fullName: { search: searchQuery } }, orderBy: { lastTimeVoted: { sort: "desc", nulls: "last" } } })
      return { success: true, data: { results: maleResult as Student[] } }

    } catch (error) {
      
      console.error(error)
      return { success: false, error: { reason: "internalError" } }

    }

  },

  femaleSearch: async ({ request }): ServerResponse<RatingVoteFemaleSearch> => {

    try {

      const data = await request.formData()
      const femaleQuery = data.get("f")

      if (!femaleQuery || femaleQuery.toString().trim().length < 1) return { success: false, error: { reason: "missing", fields: ["f"] } }
      if (femaleQuery.toString().trim().length < 3) return { success: false, error: { reason: "invalid", fields: [{ field: "f", details: "too short" }] } }

      const searchQuery = "*" + femaleQuery.toString() + "*"
      const femaleResult = await prisma.femaleStudent.findMany({ where: { fullName: { search: searchQuery } }, orderBy: { lastTimeVoted: { sort: "desc", nulls: "last" } } })
      
      return { success: true, data: { results: femaleResult } }

    } catch (error) {
      
      console.error(error)
      return { success: false, error: { reason: "internalError" } }

    }

  },

  submit: async ({ request, cookies }): ServerResponse<RatingVoteSubmit> => {

    const token = cookies.get("token")
    if (!token) return { success: false, error: { reason: "unauthorized" } }

    const data = await request.formData()

    const maleIdString = data.get("m-id")
    const femaleIdString = data.get("f-id")

    if (!maleIdString || !femaleIdString || maleIdString.toString().trim().length < 1 || femaleIdString.toString().trim().length < 1) return { success: false, error: { reason: "missing", fields: [ "m-id", "f-id" ] } }
    
    const maleId = parseInt(maleIdString.toString())
    const femaleId = parseInt(femaleIdString.toString())

    if (Number.isNaN(maleId) || Number.isNaN(femaleId)) return { success: false, error: { reason: "invalid", fields: [{ field: "m-id", details: "not a number" }, { field: "f-id", details: "not a number" }] } }

    try {
      const auth0User = await auth0.getProfile(token) as Auth0User
      let dbUser = await prisma.user.findUnique({ where: { sub: auth0User.sub } })

      if (!dbUser) return { success: false, error: { reason: "unauthorized" } }
      if (dbUser.hasVoted) return { success: false, error: { reason: "forbidden", details: "already voted" } }
      
      try {

        await prisma.maleStudent.update({ where: { id: maleId }, data: { 
          totalVotes: { increment: 1 },
          lastTimeVoted: new Date()
        }})

        await prisma.femaleStudent.update({ where: { id: femaleId }, data: {
          totalVotes: { increment: 1 },
          lastTimeVoted: new Date()
        }})

        await prisma.user.update({ where: { sub: auth0User.sub }, data: {
          hasVoted: true,
          userVotedMaleId: maleId,
          userVotedFemaleId: femaleId
        }})
  
        return { success: true, data: {} }
        
      }
      catch (error) {
        console.log(error)
        return { success: false, error: { reason: "internalError" } }
      }
  
    }
    catch (error) {
      return { success: false, error: { reason: "unauthorized" } }
    }

  }
}) satisfies Actions