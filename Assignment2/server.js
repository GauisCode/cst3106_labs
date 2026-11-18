const express = require("express");
const path = require("path");

const { randomUUID } = require("node:crypto");
const YatzeeGame = require("./game/YatzeeGame");
const { CATEGORIES } = require("./game/YatzeeEngine");

const app = express();
const PORT = 3000;
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.get("/roll-dices", (request, response) => {
  const diceValues = [];

  for (let i = 0; i < 5; i++) {
    const dieValue = Math.floor(Math.random() * 6) + 1;
    diceValues.push(dieValue);
  }

  response.json(diceValues);
});

// Each game ID points to a separate game stored in server memory.
const games = new Map();

function getGameState(id, game) {
  const { dice, engine } = game;
  const scorePreviews = {};

  if (!game.gameOver && game.rollCount > 0) {
    for (const { key } of CATEGORIES) {
      if (engine.scoreTable[key] === null) {
        scorePreviews[key] = {
          points: engine.calculateScore(key, dice.values),
          canSelect: engine.isValidSelection(key, dice.values),
        };
      }
    }
  }

  const upperSubtotal = engine.getUpperSubtotal();
  const upperBonus = engine.getUpperBonus();
  const lowerSubtotal = engine.getLowerSubtotal();
  const yatzeeBonus = engine.yatzeeBonus;

  return {
    id,
    currentPlayer: game.currentPlayer,
    currentRound: game.currentRound,
    rollCount: game.rollCount,
    gameOver: game.gameOver,
    message: game.message,
    dice: {
      values: dice.values,
      held: dice.held,
    },
    scoreTable: engine.scoreTable,
    scorePreviews,
    totalScore: game.totalScore,
    totals: {
      "upper-subtotal": upperSubtotal,
      "upper-bonus": upperBonus,
      "upper-total": upperSubtotal + upperBonus,
      "lower-subtotal": lowerSubtotal,
      "yatzee-bonus": yatzeeBonus,
      "lower-total": lowerSubtotal + yatzeeBonus,
      "grand-total": engine.getTotalScore(),
    },
  };
}

app.post("/api/games", (request, response) => {
    const id = randomUUID();
    const game = new YatzeeGame();

    games.set(id, game);

    response.status(201).json(getGameState(id, game));
});

app.get("/api/games/:id", (request, response) => {
    const id = request.params.id;
    const game = games.get(id);

    if (!game) {
        return response.status(404).json({ error: "Game not found." });
    }

    response.json(getGameState(id, game));
});
app.post("/api/games/:id/roll", (request, response) => {
  const id = request.params.id;
  const game = games.get(id);

  if (!game) {
    return response.status(404).json({ error: "Game not found." });
  }

  const previousRollCount = game.rollCount;
  game.rollDice();

  if (game.rollCount === previousRollCount) {
    const error = game.gameOver
      ? "This game is over."
      : game.rollCount >= 3
        ? "You have used all three rolls. Choose a score."
        : game.message;

    return response.status(409).json({ error });
  }

  return response.json(getGameState(id, game));
});

app.put("/api/games/:id/dice/:index/hold", (request, response) => {
  const { id, index: indexParam } = request.params;
  const game = games.get(id);

  if (!game) {
    return response.status(404).json({ error: "Game not found." });
  }

  const index = Number(indexParam);
  const held = request.body?.held;

  if (
    !Number.isInteger(index) ||
    index < 0 ||
    index >= game.dice.values.length
  ) {
    return response.status(400).json({ error: "Invalid die index." });
  }

  if (typeof held !== "boolean") {
    return response.status(400).json({ error: "held must be true or false." });
  }

  if (game.gameOver || game.rollCount === 0) {
    return response.status(409).json({
      error: "You can hold dice only after rolling in an active turn.",
    });
  }

  // existing method toggles the die, so call it only if needed.
  if (game.dice.held[index] !== held) {
    game.holdDie(index);
  }

  return response.json(getGameState(id, game));
});

app.post("/api/games/:id/scores", (request, response) => {
  const { id } = request.params;
  const game = games.get(id);
  const category = request.body?.category;

  if (!game) {
    return response.status(404).json({ error: "Game not found." });
  }

  if (!CATEGORIES.some((item) => item.key === category)) {
    return response.status(400).json({ error: "Invalid score category." });
  }

  if (game.gameOver || game.rollCount === 0) {
    return response.status(409).json({
      error: "Roll the dice in an active turn before scoring.",
    });
  }

      if (game.engine.scoreTable[category] !== null) {
        return response.status(409).json({
          error: "That category already has a recorded score.",
        });
      }

  game.scoreCategory(category);

  // A recorded score can be zero. Only null means it is unused.
  // Check for rejection before treating an existing score as a success.
  if (game.engine.scoreTable[category] === null) {
    return response.status(409).json({ error: game.message });
  }

  return response.json(getGameState(id, game));
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
