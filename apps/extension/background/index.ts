export { }

chrome.runtime.onInstalled.addListener((_) => {
    chrome.tabs.create({ url: "http://localhost:3000/auth" });
})