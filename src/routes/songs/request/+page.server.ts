import type { Auth0User, ServerResponse, SongsVoteLoad, SongsVoteSearch, SongsVoteSubmit, SpotifyTrack } from "$lib/types"
import type { Actions, PageServerLoad } from "./$types"
import auth0 from "$lib/server/auth0"
import { SPOTIFY_AUTH_HEADER } from "$env/static/private"
import prisma from "$lib/server/prisma"

export const load = (async ({ cookies }): ServerResponse<SongsVoteLoad> => {

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
    
    return { success: true, data: {} }

  }
  catch (error) {
    return { success: false, error: { reason: "unauthorized" } }
  }

}) satisfies PageServerLoad

export const actions = ({

  search: async ({ request, fetch }): ServerResponse<SongsVoteSearch> => {

    const data = await request.formData()
    const songQuery = data.get("s")

    if (!songQuery || songQuery.toString().trim().length < 1) return { success: false, error: { reason: "missing", fields: ["s"] } }

    const authBody = new URLSearchParams({ grant_type: 'client_credentials' })

    const authResponse = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Authorization": "Basic " + SPOTIFY_AUTH_HEADER,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: authBody,
    })

    if (authResponse.status !== 200) {
      console.error(await authResponse.text())
      return { success: false, error: { reason: "internalError" } }
    }
    const token = await authResponse.json()

    const searchUri = "https://api.spotify.com/v1/search?q=track%3A" + songQuery.toString() + "&type=track&market=DE&limit=10"
    const searchResponse = await fetch(searchUri, {
      headers: {
        "Authorization": token.token_type + " " + token.access_token
      }
    })

    if (searchResponse.status !== 200)
    {
      console.error(searchResponse.statusText)
      return { success: false, error: { reason: "internalError" } }
    }

    const result = await searchResponse.json()
    let songs = result.tracks.items as SpotifyTrack[]

    songs = songs.filter((song) => {
      return !song.is_local && song.is_playable
    })

    return { success: true, data: { results: songs } }

  },

  submit: async ({ request, cookies }): ServerResponse<SongsVoteSubmit> => {

    const token = cookies.get("token")
    if (!token) return { success: false, error: { reason: "unauthorized" } }

    const data = await request.formData()
    const songId = data.get("s")

    if (!songId || songId.toString().trim().length < 1) return { success: false, error: { reason: "missing", fields: ["s"] } }

    const authBody = new URLSearchParams({ grant_type: 'client_credentials' })

    const authResponse = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Authorization": "Basic " + SPOTIFY_AUTH_HEADER,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: authBody,
    })

    if (authResponse.status !== 200) {
      console.error(await authResponse.text())
      return { success: false, error: { reason: "internalError" } }
    }
    const spotifyToken = await authResponse.json()

    const searchUri = "https://api.spotify.com/v1/tracks/" + songId.toString() + "?market=DE"
    const searchResponse = await fetch(searchUri, {
      headers: {
        "Authorization": spotifyToken.token_type + " " + spotifyToken.access_token
      }
    })

    if (searchResponse.status === 400) {
      return { success: false, error: { reason: "invalid", fields: [{ field: "s", details: "does not exist" }] } }
    }
    else if (searchResponse.status !== 200)
    {
        console.error(searchResponse.statusText)
        return { success: false, error: { reason: "internalError" } }
    }

    const result = await searchResponse.json() as SpotifyTrack
    if (result.is_local || !result.is_playable) return { success: false, error: { reason: "invalid", fields: [{ field: "s", details: "does not exist" }] } }

    let artistString = ""
    result.artists.forEach((artist) => {
      artistString += artist.name + "~"
    })

    try {

      const auth0User = await auth0.getProfile(token) as Auth0User
      const dbUser = await prisma.user.findUniqueOrThrow({ where: { sub: auth0User.sub } })

      const votedSongs = await prisma.userSongRequestVote.findMany({ where: { userId: dbUser.id }, include: { request: true } })
      for (const song of votedSongs) {
        if (song.request.songId === songId) return { success: false, error: { reason: "forbidden" } }
      }

      await prisma.songRequest.upsert({ where: { songId: songId.toString() }, create: {
        songId: result.id,
        songName: result.name,
        songArtist: artistString,
        songAlbum: result.album.name,
        songUrl: result.external_urls.spotify, 
        votedUsers: {
          create: {
            userId: dbUser.id
          }
        },
        requestUserId: dbUser.id,
        totalVotes: 1,
      }, update: {
        votedUsers: {
          create: {
            userId: dbUser.id
          }
        },
        totalVotes: { increment: 1 }
      }})

      return { success: true, data: {} }

    }
    catch (error) {
      console.error(error)
      return { success: false, error: { reason: "unauthorized" } }
    }

  }

}) satisfies Actions