import type { PageServerLoad } from './$types';
import prisma from '$lib/server/prisma';
import type { RootLoad, ServerResponse } from '$lib/types';

export const load = (async (): ServerResponse<RootLoad> => {

    try {

        const males = await prisma.maleStudent.findMany({ orderBy: { totalVotes: "desc" }, take: 10 })
        const females = await prisma.femaleStudent.findMany({ orderBy: { totalVotes: "desc" }, take: 10 })

        const songs = await prisma.songRequest.findMany({ orderBy: { totalVotes: "desc" }, take: 5})

        return {
            success: true,
            data: {
                male: males,
                female: females,
                songs: songs
            }
        }
    }
    catch (error) {

        console.error(error)

        return {
            success: false,
            error: { reason: "internalError" }
        }
    }

}) satisfies PageServerLoad;