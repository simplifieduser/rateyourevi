import prisma from '$lib/server/prisma';
import type { RatingLoad, ServerResponse, Student } from '$lib/types';
import type { PageServerLoad } from './$types';

export const load = (async ({ url }): ServerResponse<RatingLoad> => {
    
    const pageString = url.searchParams.get("p") || "0"
    let page = parseInt(pageString)
    if (Number.isNaN(page)) page = 0

    const queryType = url.searchParams.get("q") || "all"

    try {
        if (queryType === "maleOnly") {
    
            const males = await prisma.maleStudent.findMany({ take: 20, skip: page * 20, orderBy: { totalVotes: "desc" } })
            return {
                success: true,
                data: {
                    page: page,
                    queryType: "maleOnly",
                    students: males as Student[]
                }
            }
    
        }
        else if (queryType === "femaleOnly") {

            const females = await prisma.femaleStudent.findMany({ take: 20, skip: page * 20, orderBy: { totalVotes: "desc" } })
            return {
                success: true,
                data: {
                    page: page,
                    queryType: "femaleOnly",
                    students: females as Student[]
                }
            }
    
        }
        else {

            const males = await prisma.maleStudent.findMany({ take: 10, skip: page * 10, orderBy: { totalVotes: "desc" } })
            const females = await prisma.femaleStudent.findMany({ take: 10, skip: page * 10, orderBy: { totalVotes: "desc" } })
            
            let list = [...males, ...females] as Student[]
            list.sort((a, b) => { return b.totalVotes - a.totalVotes })
    
            return {
                success: true,
                data: {
                    page: page,
                    queryType: "all",
                    students: list
                }
            }
    
        }
    } catch (error) {
        
        console.error(error)

        return {
            success: false,
            error: { reason: "internalError"}
        }

    }

}) satisfies PageServerLoad;