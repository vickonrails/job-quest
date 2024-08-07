import { sendToContentScript } from '@plasmohq/messaging';
import { authenticateUser } from '~utils/authenticate-user';

chrome.webNavigation.onHistoryStateUpdated.addListener(async () => {
    await sendToContentScript({
        name: 'refresh-grabber',
    })
})

chrome.runtime.onInstalled.addListener(async function (details) {
    if (details.reason === 'install') {
        await authenticateUser()
    }
});

export default {}