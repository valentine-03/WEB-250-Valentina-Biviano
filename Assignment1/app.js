// Displays 'Hello name!'
//
// References:
//   https://repl.it/languages/express
//   https://expressjs.com/en/starter/hello-world.html
// AWS Elastic Beanstalk chooses the port

const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello Valentina!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
