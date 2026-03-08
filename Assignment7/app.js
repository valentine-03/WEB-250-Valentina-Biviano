const express = require("express");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));

const upload = multer({ dest: "uploads/" });

function kmhToMph(kmh) {
    return (kmh * 0.621371).toFixed(1);
}

function getCategory(kmh) {

    if (kmh >= 252) return 5;
    if (kmh >= 209) return 4;
    if (kmh >= 178) return 3;
    if (kmh >= 154) return 2;
    if (kmh >= 119) return 1;
    return 0;
}

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/lesson7", (req, res) => {
    res.render("lesson7", { storms: null });
});

app.post("/lesson7", upload.single("stormfile"), (req, res) => {

    let storms = [];

    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on("data", (row) => {

            const kmh = parseFloat(row.kmh);

            let storm = {
                date: row.date,
                name: row.name,
                kmh: kmh,
                mph: kmhToMph(kmh),
                category: getCategory(kmh)
            };

            storms.push(storm);

        })
        .on("end", () => {

            storms.sort((a, b) => b.kmh - a.kmh);

            res.render("lesson7", { storms: storms });

        });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});