export async function authenticateUser() {
    await chrome.tabs.create({
        url: 'tabs/auth.html'
    })
}