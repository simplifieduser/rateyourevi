import prisma from "$lib/server/prisma"
import type { Auth0User, ServerResponse, SongsLoad, SongsVote } from "$lib/types"
import auth0 from "$lib/server/auth0"
import type { Actions, PageServerLoad } from "./$types"

export const load = (async ({ url }): ServerResponse<SongsLoad> => {

  const pageString = url.searchParams.get("p") || "0"
  let page = parseInt(pageString)
  if (Number.isNaN(page) || page < 0) page = 0

  try {

    const songs = await prisma.songRequest.findMany({ take: 20, skip: page * 20, orderBy: { totalVotes: "desc" } })
    return { success: true, data: { songs: songs, page: page } }

  }
  catch (error) {
    console.error(error)
    return { success: false, error: { reason: "internalError" } }
  }

}) satisfies PageServerLoad

export const actions = ({

  vote: async ({ request, cookies }): ServerResponse<SongsVote> => {

    const token = cookies.get("token")
    if (!token) return { success: false, error: { reason: "unauthorized" } }

    const data = await request.formData()
    const songIdString = data.get("s")
    if (!songIdString ||songIdString.toString().trim().length < 1) return { success: false, error: { reason: "missing", fields: ["s"] } }

    const songId = parseInt(songIdString.toString())
    if (Number.isNaN(songId)) return { success: false, error: { reason: "invalid", fields: [{ field: "s", details: "not a number" }] } }

    try {
  
        const auth0User = await auth0.getProfile(token) as Auth0User
        const dbUser = await prisma.user.findUnique({ where: { sub: auth0User.sub } })
        if (!dbUser) return { success: false, error: { reason: "unauthorized" } }

        const votedSongs = await prisma.userSongRequestVote.findMany({ where: { userId: dbUser.id }, include: { request: true } })
        for (const song of votedSongs) {
          if (song.request.id === songId) return { success: false, error: { reason: "forbidden" } }
        }
  
        try {
  
          await prisma.songRequest.update({ where: { id: songId }, data: {
            totalVotes: { increment: 1 },
            votedUsers: { create: { userId: dbUser.id }}
          }})
          return { success: true, data: {} }
  
        }
        catch (error) {
          return { success: false, error: { reason: "invalid", fields: [{ field: "s", details: "does not exist" }] } }
        }

    } catch (error) {
      return { success: false, error: { reason: "unauthorized" } }
    }

  }


}) satisfies Actions