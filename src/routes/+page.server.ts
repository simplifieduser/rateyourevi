import type { PageServerLoad } from './$types';
import prisma from '$lib/server/prisma';
import type { RootLoad, ServerResponse } from '$lib/types';

export const load = (async (): ServerResponse<RootLoad> => {

    try {

        const males = await prisma.maleStudent.findMany({ orderBy: { totalVotes: "desc" }, take: 10 })
        const females = await prisma.femaleStudent.findMany({ orderBy: { totalVotes: "desc" }, take: 10 })

        return {
            success: true,
            data: {
                male: males,
                female: females
            }
        }
    }
    catch (error) {
        return {
            success: false,
            error: { reason: "internalError" }
        }
    }

}) satisfies PageServerLoad;