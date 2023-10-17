import type { PlasmoCSConfig } from "plasmo";
import { sendToBackground } from "@plasmohq/messaging";

export const config: PlasmoCSConfig = {
    matches: ["http://localhost:3000/auth"],
}

window.addEventListener('message', async (evt) => {
    console.log({ origin: evt.origin })
    if (evt.data.type === 'auth' && evt.origin === 'http://localhost:3000') {
        console.log(`Bout sending ${evt.data}`);

        sendToBackground({
            name: 'handle-auth',
            body: { ...evt.data }
        })
    }
})