# Yatzee — Single-Player Dice Game

Author: Jamal St. Lewis  
Course: CST3106 — Internet Architecture and Web Development  
Project: Assignment 2 — Yatzy Game App Enhancement with Node.js and Express

## Project Overview

Yatzee is a single-player dice game based on the 13-category Yahtzee scoring
variant. This version builds on Assignment 1 by moving dice rolls, held dice,
scoring, and turn progression to a Node.js and Express server.

The browser uses the Fetch API to send player actions and display the updated
game state. HTML and CSS provide the responsive layout, and jQuery is used for
dice drawing and animation. The interface retains the dark-green and gold
colour scheme from my portfolio.

## Setup and Startup

1. Install Node.js and npm if they are not already installed.
2. Clone or download the `yatzy` repository.
3. From the repository root, run:

   ```powershell
   cd assignment2
   npm install
   node server.js
   ```

   If your terminal is already in the `assignment2` folder, skip `cd assignment2`.
   Use the folder's actual capitalization if it differs from the example.

4. Open `http://localhost:3000` in your browser. Keep the terminal running while
   you play. Press `Ctrl+C` in that terminal to stop the server.

Open the game through Express rather than opening `public/index.html` directly,
because the browser needs to reach the game's API.

## File Organization

| File or folder | Responsibility |
|---|---|
| `server.js` | Serves the browser files, defines the API routes, and stores game instances |
| `game/YatzeeDice.js` | Generates dice values and manages held dice |
| `game/YatzeeEngine.js` | Validates selections and calculates previews, scores, bonuses, and totals |
| `game/YatzeeGame.js` | Coordinates rolls, turns, scoring, and game completion |
| `public/index.html` | Displays the game, animates the dice, and sends player actions to the API |
| `public/YatzyStyle.css` | Styles the dice, controls, scorecard, and responsive layout |

## API Usage

The local server runs at `http://localhost:3000`. Replace `:id` with the game ID
returned by `POST /api/games`. Die indexes run from `0` to `4`.

| Method | Endpoint | Request body | Purpose |
|---|---|---|---|
| `POST` | `/api/games` | None | Creates a new game and returns its ID and starting state |
| `GET` | `/api/games/:id` | None | Returns the current game state without changing it |
| `POST` | `/api/games/:id/roll` | None | Rolls the unheld dice and updates the roll count |
| `PUT` | `/api/games/:id/dice/:index/hold` | `{"held":true}` or `{"held":false}` | Holds or releases the specified die |
| `POST` | `/api/games/:id/scores` | `{"category":"chance"}` | Records the server-calculated score for the selected category |

Send `Content-Type: application/json` with the Hold and Score request bodies.
Successful actions return the updated game state, including the dice, scorecard,
score previews, and totals. The browser sends the category key, not the point
value.

Games are stored in server memory. No database is required, and restarting
the server clears existing games.

## How to Play

1. Select **Roll Dice** to roll all five dice.
2. Click a die to hold it, or click it again to release it. Only unheld dice
   are rerolled.
3. Take up to three rolls per turn. You can score after any roll.
4. Click a highlighted score box to record its points and end the turn.
5. Fill all 13 categories to finish the game. Select **New Game** to start a
   fresh server game.

A score preview does not count toward the total until it is recorded. A blank
box is unused; a recorded `0` is a used category and stays locked.

## Scoring Notes

- An upper-section subtotal of at least 63 earns a 35-point bonus.
- Five matching dice score 50 in the Yatzee category.
- An eligible additional Yatzee earns 100 bonus points when the original Yatzee
  category already contains 50. The bonus is awarded when the player records an
  allowed category under the Joker rules. It does not grant an extra turn.

## Testing Checklist

- Hold a die and confirm that its value stays unchanged on the next roll.
- Confirm that a fourth roll is not allowed in the same turn.
- Record a score and confirm that its box locks, the totals update, and the next
  turn starts at zero rolls.
- Fill all 13 categories and confirm that the final score is displayed and
  rolling is disabled.
- Start a new game and confirm that the scorecard and totals clear and the next
  roll uses the new game ID.