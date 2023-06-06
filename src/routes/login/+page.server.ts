import prisma from '$lib/server/prisma';
import type { LoginAction, ServerResponse } from '$lib/types';
import type { Actions, PageServerLoad } from './$types';
import crypto from "crypto"
import { WebAuth } from "auth0-js"

export const load = (async () => {


}) satisfies PageServerLoad;