chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getTimestamp") {
    const player = document.querySelector("video");
    if (player) {
      sendResponse({ timestamp: Math.floor(player.currentTime) });
    } else {
      sendResponse({ error: "No video found" });
    }
  }
  return true; 
});

'''hello im there'''