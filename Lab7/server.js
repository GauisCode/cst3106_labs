const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "public")));

app.get("/roll-dices", (request, response) => {
  const diceValues = [];

  for (let i = 0; i < 5; i++) {
    const dieValue = Math.floor(Math.random() * 6) + 1;
    diceValues.push(dieValue);
  }

  response.json(diceValues);
});
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
