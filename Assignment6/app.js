const express = require("express");
const multer = require("multer");
const fs = require("fs");
const { parse } = require("csv-parse/sync");
const path = require("path");

const app = express();
const upload = multer({ dest: "uploads/" });

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname)));

// Home
app.get("/", (req, res) => {
  res.render("index", { data: null });
});

// CSV upload
app.post("/upload", upload.single("csvFile"), (req, res) => {
  const filePath = req.file.path;

  // Read file
  const fileContent = fs.readFileSync(filePath, "utf-8");

  let records = parse(fileContent, {
    trim: true,
    skip_empty_lines: true,
  });

  // Sort by continent, then country
  records.sort((a, b) => {
    if (a[2] === b[2]) {
      return a[3].localeCompare(b[3]);
    }
    return a[2].localeCompare(b[2]);
  });

  res.render("index", { data: records });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});