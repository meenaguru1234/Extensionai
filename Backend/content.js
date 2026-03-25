// 🔴 Replace all images with red boxes
function blockImages() {
  document.querySelectorAll("img").forEach((img) => {
    const rect = img.getBoundingClientRect();

    const div = document.createElement("div");
    div.style.backgroundColor = "red";
    div.style.width = rect.width ? rect.width + "px" : "100px";
    div.style.height = rect.height ? rect.height + "px" : "100px";
    div.style.display = "inline-block";

    img.replaceWith(div);
  });
}

// Run once when page loads
blockImages();

// 🔁 Handle dynamically loaded images (important)
const observer = new MutationObserver(() => {
  blockImages();
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

// 🎨 Listen for color change from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "CHANGE_COLOR") {
    document.body.style.backgroundColor = message.color;
  }
});