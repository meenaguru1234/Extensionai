const express = require("express");
const cors = require("cors");
const fs = require("fs-extra");
const archiver = require("archiver");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());


const TEMP_DIR = path.join(__dirname, "tmp");

// Mock AI response (replace with OpenAI API)
const generateCode = async (prompt) => {

  console.log("PROMPT:", prompt);

  const text = prompt.toLowerCase();

  // 👉 DARK MODE
//   if (text.includes("dark") || text.includes("black")) {
//     return {
//       files: {
//         "manifest.json": JSON.stringify({
//           manifest_version: 3,
//           name: "Dark Mode",
//           version: "1.0",
//           content_scripts: [
//             {
//               matches: ["<all_urls>"],
//               js: ["content.js"]
//             }
//           ]
//         }, null, 2),

//         "content.js": `
// document.body.style.backgroundColor = "black";
// document.body.style.color = "white";
//         `,

//         "popup.html": `
// <h2>Dark Mode Enabled</h2>
//         `
//       }
//     };
//   }

  // 👉 BACKGROUND COLOR
//   if (text.includes("background")) {
//     return {
//       files: {
//   "manifest_version": 3,
//   "name": "Background Color Changer",
//   "version": "1.0",
//   "permissions": ["activeTab", "scripting", "storage"],
//   "action": {
//     "default_popup": "popup.html"
//   },
//   "content_scripts": [
//     {
//       "matches": ["<all_urls>"],
//       "js": ["content.js"]
//     }
//   ]
// }
//     };
//   }

  // 👉 IMAGE BLOCKER (default)
  return {
    files: {
      "manifest.json": JSON.stringify({
        manifest_version: 3,
        name: "Background Color Changer",
        version: "1.0",
        content_scripts: [
          {
            matches: ["<all_urls>"],
            js: ["content.js"]
          }
        ]
      }, null, 2),

      "content.js": `
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
      `,

      "popup.html": `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Background Color Changer</title>
</head>

<body style="width:200px; padding:15px; font-family:Arial, sans-serif;">
    
    <h3>Background color</h3>

    <div class="color-picker" style="margin:10px 0; width:100%; display:flex; align-items:center; gap:10px;">
        
        <input 
            type="color" 
            id="colorinput" 
            value="#ffffff"
            style="flex-grow:1; height:30px; border:1px solid #ccc; border-radius:4px; padding:2px 5px;"
        />

    </div>

    <button 
        id="applyButton" 
        style="width:100%; padding:8px; background-color:#4CAF50; color:white; border:none; border-radius:4px; cursor:pointer;"
    >
        Apply Color
    </button>

    <script src="popup.js"></script>

</body>
</html>
      `
    }
  };
};

// API

app.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    const result = await generateCode(prompt);

    const folderPath = path.join(__dirname, "tmp", "ext");
    const zipPath = path.join(__dirname, "tmp", "test.zip");

    // ✅ clean old files
    await fs.remove(folderPath);
    await fs.remove(zipPath);

    await fs.ensureDir(folderPath);

    // write files
    for (const [filename, content] of Object.entries(result.files)) {
      await fs.writeFile(path.join(folderPath, filename), content);
    }

    // create zip
    const output = fs.createWriteStream(zipPath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    archive.pipe(output);
    archive.directory(folderPath, false);

    await archive.finalize();

    // ✅ VERY IMPORTANT
    output.on("close", () => {
      console.log("ZIP created:", zipPath);

      res.json({
        files: result.files,
        downloadUrl: "http://localhost:5000/download"
      });
    });

  } catch (err) {
    console.error("ZIP ERROR:", err);
    res.status(500).json({ error: "ZIP error" });
  }
});
// Download
app.get("/download", (req, res) => {
  const filePath = path.join(__dirname, "tmp", "test.zip");

  res.download(filePath, "extension.zip");
});

app.listen(5000, () => console.log("Server running on 5000"));
