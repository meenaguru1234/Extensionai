
const fs = require("fs");
const path = require("path");

const data = require("./test.json");

const folder = "./output";
if (!fs.existsSync(folder)) fs.mkdirSync(folder);

for (const [file, content] of Object.entries(data.files)) {
  fs.writeFileSync(path.join(folder, file), content);
}

console.log("Files created!");