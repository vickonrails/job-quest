import { type PlasmoMessaging } from "@plasmohq/messaging"
import type { Session, User } from "@supabase/supabase-js"
import qs from 'qs'
import { supabase as client } from "~core/supabase"

const SUPABASE_URL = process.env.PLASMO_PUBLIC_SUPABASE_URL;

interface HandlerResponse {
    data?: {
        user: User,
        session: Session
    },
    error?: string | null
}

type AuthResponse = {
    access_token: string,
    refresh_token: string
}

const handler: PlasmoMessaging.MessageHandler<any, HandlerResponse> = async (req, res) => {
    const redirectUri = chrome.identity.getRedirectURL('callback')
    const options = {
        provider: 'google',
        redirect_to: redirectUri
    }
    const url = `${SUPABASE_URL}/auth/v1/authorize?${qs.stringify(options)}`

    try {
        const authorizeResult = await new Promise((resolve, reject) => {
            chrome.identity.launchWebAuthFlow({
                url,
                interactive: true
            }, (callbackUrl) => {
                resolve(callbackUrl)
            })
        }) as string;

        if (!authorizeResult) {
            throw new Error();
        }

        const { refresh_token, access_token } = qs.parse(authorizeResult?.split("#")[1]) as AuthResponse;
        const { data: { session } } = await client.auth.setSession({ access_token, refresh_token })
        const { data: { user } } = await client.auth.getUser();

        res.send({
            data: {
                session,
                user
            }
        })
    } catch {
        res.send({
            error: "Error in authorization"
        })
    }
}

export default handler