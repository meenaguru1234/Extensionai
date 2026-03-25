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
  if (text.includes("dark") || text.includes("black")) {
    return {
      files: {
        "manifest.json": JSON.stringify({
          manifest_version: 3,
          name: "Dark Mode",
          version: "1.0",
          content_scripts: [
            {
              matches: ["<all_urls>"],
              js: ["content.js"]
            }
          ]
        }, null, 2),

        "content.js": `
document.body.style.backgroundColor = "black";
document.body.style.color = "white";
        `,

        "popup.html": `
<h2>Dark Mode Enabled</h2>
        `
      }
    };
  }

  // 👉 BACKGROUND COLOR
  if (text.includes("background")) {
    return {
      files: {
        "manifest.json": JSON.stringify({
          manifest_version: 3,
          name: "Background Changer",
          version: "1.0",
          content_scripts: [
            {
              matches: ["<all_urls>"],
              js: ["content.js"]
            }
          ]
        }, null, 2),

        "content.js": `
document.body.style.backgroundColor = "red";
        `,

        "popup.html": `
<h2>Background Changed</h2>
        `
      }
    };
  }

  // 👉 IMAGE BLOCKER (default)
  return {
    files: {
      "manifest.json": JSON.stringify({
        manifest_version: 3,
        name: "Image Blocker",
        version: "1.0",
        content_scripts: [
          {
            matches: ["<all_urls>"],
            js: ["content.js"]
          }
        ]
      }, null, 2),

      "content.js": `
document.querySelectorAll('img').forEach(img => {
  const div = document.createElement('div');
  div.style.background = 'red';
  div.style.width = '100px';
  div.style.height = '100px';
  img.replaceWith(div);
});
      `,

      "popup.html": `
<h2>Images Blocked</h2>
      `
    }
  };
};

// API
app.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    console.log("PROMPT:", prompt);

    const aiResponse = await generateCode(prompt);

    res.json({
      files: aiResponse.files,
      downloadUrl: "http://localhost:5000/download/test"
    });

  } catch (err) {
    console.error("ERROR:", err);

    res.status(500).json({
      error: "Backend error",
      message: err.message
    });
  }
});
// Download
app.get("/download/:id", (req, res) => {
  const zipPath = path.join(TEMP_DIR, `${req.params.id}.zip`);
  res.download(zipPath);
});

app.listen(5000, () => console.log("Server running on 5000"));