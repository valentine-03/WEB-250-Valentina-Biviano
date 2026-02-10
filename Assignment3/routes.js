const express = require('express')
const fs = require("fs");
const handlebars = require('handlebars');
const router = express.Router()

router.get("/", function (request, response) {
    let result = "";
    if (request.query.fahrenheit) {
        let fahrenheit = request.query.fahrenheit;
        let celsius = (fahrenheit - 32) * 5 / 9;
        result = fahrenheit + "° Fahrenheit is " +
            celsius + "° Celsius";
    }

    let source = fs.readFileSync("./templates/lesson3.html");
    let template = handlebars.compile(source.toString());
    let data = {
        fahrenheit: result,
        celsius: ""
    }
    result = template(data);
    response.send(result);
});

router.post("/", function (request, response) {
    let result = "";

    if (request.body.celsius) {
        let celsius = request.body.celsius;
        let fahrenheit = celsius * 9 / 5 + 32;
        result = celsius + "° Celsius is " +
            fahrenheit + "° Fahrenheit";
    }

    let source = fs.readFileSync("./templates/lesson3.html");
    let template = handlebars.compile(source.toString());
    let data = {
        fahrenheit: "",
        celsius: result
    }
    result = template(data);
    response.send(result);
});

module.exports = router;