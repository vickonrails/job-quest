import { sendToContentScript } from '@plasmohq/messaging'

chrome.webNavigation.onHistoryStateUpdated.addListener(async (details) => {
    await sendToContentScript({
        name: 'refresh-grabber',
    })
})

export default {}