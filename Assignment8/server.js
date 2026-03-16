// Valentina Biviano
//  WEB 250 - Assignment 8 Internet Data
// 3/16/2026

const express = require("express");
const fetch = require("node-fetch");

const app = express();
const PORT = 3000;

// Wikidata JSON data source from assignment
const url = "https://query.wikidata.org/sparql?query=%23%20Tropical%20Cyclones%20and%20Maximum%20Sustained%20Winds%0A%0ASELECT%20DISTINCT%20%3FDate%20%3FStorm%20%3FMaximumSustainedWinds%0AWHERE%20%7B%0A%20%20%3FstormItem%20wdt%3AP31%20wd%3AQ8092.%0A%20%20%7B%0A%20%20%20%20%3FstormItem%20rdfs%3Alabel%20%3FStorm.%0A%20%20%20%20FILTER((LANG(%3FStorm))%20%3D%20%22en%22)%0A%20%20%7D%0A%0A%20%20%3FstormItem%20wdt%3AP580%20%3FDate.%0A%20%20%0A%20%20%3FstormItem%20wdt%3AP2895%20%3FMaximumSustainedWindsValue%20.%0A%20%20%3FstormItem%20p%3AP2895%2Fpsv%3AP2895%20%3FmaximumSustainedWinds.%0A%20%20%3FmaximumSustainedWinds%20wikibase%3AquantityUnit%20%3FmaximumSustainedWindsUnit.%0A%20%20%7B%0A%20%20%20%20%3FmaximumSustainedWindsUnit%20rdfs%3Alabel%20%3FmaximumSustainedWindsLabel.%0A%20%20%20%20FILTER((LANG(%3FmaximumSustainedWindsLabel))%20%3D%20%22en%22)%0A%20%20%20%20FILTER(CONTAINS(%3FmaximumSustainedWindsLabel%2C%20%22kilometre%20per%20hour%22))%0A%20%20%7D%0A%20%20BIND(CONCAT(STR(%3FMaximumSustainedWindsValue)%2C%20%22%20km%2Fh%22)%20AS%20%3FMaximumSustainedWinds)%0A%7D%0AORDER%20BY%20(%3FDate)&format=json";

// convert km/h → mph
function kmhToMph(kmh) {
  return (kmh * 0.621371).toFixed(1);
}

function getCategory(kmh) {
  if (kmh >= 252) return { name: "Category 5", class: "cat5" };
  if (kmh >= 209) return { name: "Category 4", class: "cat4" };
  if (kmh >= 178) return { name: "Category 3", class: "cat3" };
  if (kmh >= 154) return { name: "Category 2", class: "cat2" };
  if (kmh >= 119) return { name: "Category 1", class: "cat1" };
  return { name: "Tropical Storm", class: "storm" };
}

// main route
app.get("/", async (req, res) => {
  try {

    const response = await fetch(url, {
      headers: { "User-Agent": "WEB250-Assignment8-StudentApp" }
    });

    const data = await response.json();

    // Array of dictionaries
    let storms = data.results.bindings.map((item) => {

      // extract number from "120 km/h"
      let kmh = parseFloat(item.MaximumSustainedWinds.value);

      let category = getCategory(kmh);

      return {
        name: item.Storm.value,
        date: item.Date.value.substring(0, 10),
        kmh: kmh,
        mph: kmhToMph(kmh),
        category: category.name,
        class: category.class
      };

    });

    // sort storms by wind speed (descending)
    storms.sort((a, b) => b.kmh - a.kmh);

    // generate table rows
    let rows = storms.map((s) => `
      <tr class="${s.class}">
        <td>${s.date}</td>
        <td>${s.name}</td>
        <td>${s.mph}</td>
        <td>${s.kmh}</td>
        <td>${s.category}</td>
      </tr>
    `).join("");

    res.send(`
    <html>
    <head>
      <title>Tropical Cyclone Data</title>
      <link rel="stylesheet" href="/style.css">
    </head>

    <body>

    <h1>Tropical Cyclones by Wind Speed</h1>

    <table>
      <tr>
        <th>Date</th>
        <th>Storm</th>
        <th>Wind (mph)</th>
        <th>Wind (km/h)</th>
        <th>Category</th>
      </tr>

      ${rows}

    </table>

    </body>
    </html>
    `);

  } catch (err) {
    console.log(err);
    res.send("Error retrieving storm data");
  }
});

app.use(express.static("public"));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});