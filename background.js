chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "navigate") {
    chrome.tabs.create({
      url: `${message.url}&t=${message.timestamp}s`
    });
  }
});