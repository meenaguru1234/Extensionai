// 🎨 Apply background color
document.getElementById("applyButton").addEventListener("click", async () => {
  const color = document.getElementById("colorinput").value;

  try {
    // தற்போதைய active tab எடுக்க
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true
    });

    // content.js க்கு message அனுப்பு
    chrome.tabs.sendMessage(tab.id, {
      type: "CHANGE_COLOR",
      color: color
    });

  } catch (err) {
    console.error("Error:", err);
  }
});