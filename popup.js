document.addEventListener("DOMContentLoaded", () => {
  const bookmarkButton = document.getElementById("bookmark");
  const bookmarksList = document.getElementById("bookmarks");

  // Load bookmarks from storage
  chrome.storage.sync.get("bookmarks", (data) => {
    const bookmarks = data.bookmarks || [];
    bookmarks.forEach(addBookmarkToList);
  });

  // Add current timestamp to bookmarks
  bookmarkButton.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (!activeTab.url.includes("youtube.com/watch")) {
        alert("Please use this extension on a YouTube video page.");
        return;
      }

      chrome.tabs.sendMessage(
        activeTab.id,
        { action: "getTimestamp" },
        (response) => {
          if (chrome.runtime.lastError || !response || response.error) {
            alert("Error: Unable to get the timestamp. Please reload the page and try again.");
          } else {
            const bookmark = {
              url: activeTab.url,
              timestamp: response.timestamp
            };
            chrome.storage.sync.get("bookmarks", (data) => {
              const bookmarks = data.bookmarks || [];
              bookmarks.push(bookmark);
              chrome.storage.sync.set({ bookmarks }, () => {
                addBookmarkToList(bookmark);
              });
            });
          }
        }
      );
    });
  });

  // Add bookmark to the list in the popup
  function addBookmarkToList(bookmark) {
    const listItem = document.createElement("li");
    listItem.textContent = `Timestamp: ${bookmark.timestamp}s`;
    listItem.style.cursor = "pointer";
    listItem.addEventListener("click", () => {
      chrome.runtime.sendMessage({
        action: "navigate",
        url: bookmark.url,
        timestamp: bookmark.timestamp
      });
    });
    bookmarksList.appendChild(listItem);
  }
});
