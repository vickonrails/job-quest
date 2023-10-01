export { }

chrome.runtime.onInstalled.addListener((details) => {
    chrome.runtime.openOptionsPage();
})