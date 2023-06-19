import prisma from "$lib/server/prisma"
import type { ServerResponse, SongsAdminLoad, SongsAdminRemove } from "$lib/types"
import { redirect } from "@sveltejs/kit"
import type { Actions, PageServerLoad } from "./$types"
import { get } from '@vercel/edge-config';

export const load = (async ({ url, cookies }): ServerResponse<SongsAdminLoad> => {

  const code = cookies.get("adminCode")
  if (!code) throw redirect(302, "/songs/admin/verify?r=missing")
  if (code !== await get("admin-code")) throw redirect(302, "/songs/admin/verify?r=invalid")

  const pageString = url.searchParams.get("p") || "0"
  let page = parseInt(pageString)
  if (Number.isNaN(page) || page < 0) page = 0

  try {

    const songs = await prisma.songRequest.findMany({ take: 20, skip: page * 20, orderBy: { totalVotes: "desc" } })
    return { success: true, data: { songs: songs, page: page } }

  }
  catch (error) {
    return { success: false, error: { reason: "internalError" } }
  }

}) satisfies PageServerLoad

export const actions = ({

  remove: async ({ request }): ServerResponse<SongsAdminRemove> => {

    const data = await request.formData()
    const requestIdString = data.get("s")
    if (!requestIdString || requestIdString.toString().trim().length < 1) return { success: false, error: { reason: "missing", fields: ["s"] } }

    const requestId = parseInt(requestIdString.toString())
    if (Number.isNaN(requestId)) return { success: false, error: { reason: "invalid", fields: [{ field: "s", details: "not a number"}] } }

    try {

      await prisma.songRequest.delete({ where: { id: requestId }, include: { votedUsers: true } })
      return { success: true, data: {}}
  
    } catch (error) {
      console.error(error)
      return { success: false, error: { reason: "internalError" } }
    }
    
  }

}) satisfies Actions