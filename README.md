# Yatzee — Single-Player Dice Game

Author: Jamal St. Lewis  
Course: CST3106 — Internet Architecture and Web Development  
Project: Assignment 1

## 1. Project Overview

Yatzee is a single-player, browser-based dice game built with HTML, CSS,
and JavaScript.

The player rolls five dice, chooses which dice to hold, and records points
in different scoring categories. Each category can be used once. The game
finishes when all 13 categories have been recorded.

The project builds on the design planning from Lab 05 and the class structure
introduced in Lab 06.

The interface uses the dark-green and gold colour scheme from my portfolio.

### Rules Variant

This project uses the 13-category Yahtzee scoring variant.

The project and class names use the spelling "Yatzee", while the scoring
rules are based on Yahtzee because I don't want to change it at this point

## 2. Technologies

- HTML: page structure, dice controls, instructions, and scorecard.
- CSS: colours, typography, spacing, scorebox states, and responsive layout.
- JavaScript: dice rolling, held states, scoring, turns, and interface updates.

No framework, server, database, or installation of dependencies is required.

## 3. File Structure

```text
yatzy/
├── YatzeeIndex.html
├── YatzeeDice.js
├── YatzeeEngine.js
├── YatzeeGame.js
├── YatzyStyle.css
├── README.md
└── screenshots/
    ├── game-desktop.png
    └── game-mobile.png
```

The screenshots folder is added when documentation screenshots are captured.

### File Responsibilities

| File | Responsibility |
|---|---|
| `YatzeeIndex.html` | Game interface, HTML elements, UI event listeners, and display functions |
| `YatzeeDice.js` | Dice values, random rolls, held states, and dice resets |
| `YatzeeEngine.js` | Category definitions, scoring calculations, score table, bonuses, and selection validation |
| `YatzeeGame.js` | Current player, round, roll count, total score, and game lifecycle |
| `YatzyStyle.css` | Shared colours, layout, controls, scorebox styling, and responsive rules |
| `README.md` | Gameplay instructions, design documentation, and testing checklist |

## 4. How to Run

1. Download or clone this repository.
2. Keep the HTML, CSS, and JavaScript files in the same folder.
3. Open `YatzeeIndex.html` in a modern web browser.

The project can problably also run locally on yoru servce

The external JavaScript files are loaded before the inline UI script:

```html
<script src="YatzeeDice.js"></script>
<script src="YatzeeEngine.js"></script>
<script src="YatzeeGame.js"></script>
```

The file names and capitalization must match the actual files.

## 5. How to Play

### Objective

Earn the highest total score possible by choosing suitable categories
for the dice rolled.

### Turn Sequence

1. Select Roll Dice to roll all five dice.
2. Select individual dice to hold them.
3. Select a held die again to release it.
4. Reroll the dice that are not held.
5. Maximimum of three rolls per turn
6. Select an unused category scorebox to record its points and end the turn.

The player can choose a category after the first or second roll without
using all three rolls.

Each turn a player must fill one unused category. A category that does not qualify
can be recorded with zero points when the selection is allowed.

### Controls

| Control | Action |
|---|---|
| Roll Dice | Rolls all dice that are not held |
| Individual die | Toggles between held and available |
| Highlighted category scorebox | Records the displayed score and ends the turn |
| New Game | Resets the game after confirmation when progress exists |

There is no separate End Turn button. Selecting a category scorebox both
records the score and finishes the turn.

## 6. Scorecard Behaviour

The scorecard highlights potential scores to differentiate from recorded scored of categories already used.

### Before Rolling

Unused category scoreboxes are blank.

### After Rolling

Unused categories display the points available for the current dice values.

These values are previews only. They do not increase the player's total.

The previews update after each successful roll.

### Selecting a Category

When a selectable scorebox is chosen:

1. The engine validates the selection.
2. The category score is recorded.
3. The scorebox becomes locked.
4. Upper, lower, bonus, and grand totals update.
5. The turn ends.
6. Other unused scoreboxes return to blank.

### Recorded Zero Versus Unused

- Blank: the category has not been used.
- Preview `0`: the category can be selected for zero points.
- Recorded `0`: the category has been used and cannot be selected again.

Internally, unused categories contain `null`, while a recorded zero
contains the number `0`.

### Visual States

| State | Meaning |
|---|---|
| Blank scorebox | Unused category before a roll |
| Gold-highlighted preview | Category is available for selection |
| Locked recorded score | Category has already been used |
| Unavailable preview | Current scoring rules prevent selecting that category |

## 7. Scoring Rules

### Upper Section

| Category | Score |
|---|---|
| Ones | Sum of dice showing 1 |
| Twos | Sum of dice showing 2 |
| Threes | Sum of dice showing 3 |
| Fours | Sum of dice showing 4 |
| Fives | Sum of dice showing 5 |
| Sixes | Sum of dice showing 6 |

### Upper Bonus

An upper-section subtotal of at least 63 earns a 35-point bonus.

The bonus is calculated from the subtotal rather than repeatedly added,
preventing it from being awarded more than once.

### Lower Section

| Category | Requirement | Score |
|---|---|---|
| Three of a Kind | At least three matching dice | Sum of all five dice |
| Four of a Kind | At least four matching dice | Sum of all five dice |
| Full House | Three of one value and two of another | 25 |
| Small Straight | Four consecutive values | 30 |
| Large Straight | Five consecutive values | 40 |
| Yatzee | Five matching dice | 50 |
| Chance | Any combination | Sum of all five dice |

Valid Small Straights include:

- 1, 2, 3, 4
- 2, 3, 4, 5
- 3, 4, 5, 6

A duplicate does not prevent a Small Straight if four consecutive values
are still present. For example, `1, 2, 2, 3, 4` qualifies.

Valid Large Straights are:

- 1, 2, 3, 4, 5
- 2, 3, 4, 5, 6

A normal Full House requires two different values. Five matching dice do
not qualify as a normal Full House unless Joker scoring applies.

### Additional Yatzee Bonus

An additional five-of-a-kind earns 100 bonus points when the Yatzee category
already contains 50 points.

If the Yatzee category contains zero, no additional 100-point bonus is awarded.

Bonus points are awarded when the turn is recorded, not while displaying
previews.

### Joker Placement Rules

When five matching dice are rolled after the Yatzee category has already
been filled:

1. The matching upper-section category must be selected if it is unused.
2. If that upper category is already filled, an unused lower category must
   be selected.
3. If all lower categories are filled, another unused upper category is
   selected for zero points.

When a lower category is available under Joker rules:

- Three of a Kind, Four of a Kind, and Chance score the dice total.
- Full House scores 25.
- Small Straight scores 30.
- Large Straight scores 40.

The interface disables category scoreboxes that are not allowed by the
current placement rules.

## 8. Totals and End of Game

The scorecard displays:

| Total | Calculation |
|---|---|
| Upper subtotal | Ones through Sixes |
| Upper bonus | 35 if the upper subtotal is at least 63; otherwise 0 |
| Upper total | Upper subtotal + upper bonus |
| Lower subtotal | Recorded lower-category scores |
| Yatzee bonuses | Accumulated additional-Yatzee bonus points |
| Lower total | Lower subtotal + Yatzee bonuses |
| Grand total | Upper total + lower total |

The game ends when all 13 categories have been recorded.

The final score is displayed in the status message. Rolling and category
selection are then disabled.

New Game clears the board and begins another game. It resets the game rather
than preserving an early final result.

## 9. JavaScript Organization

The project separates game logic from page display code.

```text
Player action
      ↓
UI event listener
      ↓
YatzeeGame coordinates the action
      ↓
YatzeeDice or YatzeeEngine updates the state
      ↓
render() displays the updated state
```

### YatzeeDice

Properties:

- `numberOfDice`
- `values`
- `held`

Methods:

- `roll()`: returns one random integer from 1 to 6.
- `rollAvailable()`: rerolls dice that are not held.
- `toggleHold(index)`: holds or releases one die.
- `reset()`: clears values and held states.

### YatzeeEngine

Properties:

- `scoreTable`
- `yatzeeBonus`

Responsibilities:

- Validate dice values and category selections.
- Calculate potential scores.
- Record category scores.
- Apply bonus and Joker rules.
- Calculate subtotals and totals.
- Detect a completed scorecard.

The engine owns the score table. The UI reads it for display but does not
directly record category scores.

### YatzeeGame

Properties:

- `currentPlayer`
- `currentRound`
- `rollCount`
- `totalScore`
- `gameOver`
- `message`
- `dice`
- `engine`

Methods:

- `startNewGame()`
- `rollDice()`
- `holdDie(index)`
- `scoreCategory(category)`
- `endTurn()`
- `endGame()`

This is a single-player game, so `currentPlayer` remains `"Player 1"`.

### UI Functions in index.html

- `buildScorecard()`: creates category rows and scoreboxes.
- `updateDiceDisplay()`: displays dice values and held states.
- `updateScoreTable()`: displays recorded scores and previews.
- `updateTotals()`: displays totals from recorded scores.
- `render()`: refreshes the interface after an action.

## 10. Design System

### Colour Palette

The green-and-gold palette connects the game to my portfolio design.

Dark green provides the main visual identity. Gold highlights selectable
states and important interface details. Light surfaces and dark body text
support readability.

| Token | Hex value | Use |
|---|---|---|
| `--green-dark` | `#0B3D2E` | Header, footer, and dark text accents |
| `--green` | `#146C4E` | Primary buttons, headings, and dice borders |
| `--green-hover` | `#0E513B` | Primary-button hover state |
| `--gold` | `#D5A72C` | Accent borders and preview/held-state emphasis |
| `--gold-light` | `#FFF4D6` | Held dice and selectable scorebox backgrounds |
| `--text` | `#1F2937` | Main text and recorded scores |
| `--muted` | `#4B5563` | Supporting text |
| `--page` | `#F6F7F5` | Page background |
| `--surface` | `#FFFFFF` | Panels and dice backgrounds |
| `--border` | `#D1D5DB` | Dividers and panel borders |

### Typography

The project uses:

```css
font-family: Aptos, Arial, Helvetica, sans-serif;
```

The font stack provides fallback fonts if Aptos is unavailable.

Body text uses a readable base size and `line-height: 1.6`. Headings are
larger and use bold weight to establish hierarchy.

### Spacing and Components

The layout uses reusable spacing values based primarily on 8px increments.

Main components include:

- Dark-green page header and footer.
- White game panels.
- Square dice buttons.
- Green action buttons.
- Gold-highlighted selectable scoreboxes.
- A two-column scorecard with category names and scoreboxes.

Held dice display the word "Held" in addition to a visual colour change.

## 11. Responsive Layout

The desktop layout uses two columns:

- Left: dice, controls, and status.
- Right: scorecard.

At widths of 800px or less, the panels stack vertically.

Smaller-screen adjustments include:

- Reduced padding.
- Wrapping dice and button rows.
- Smaller dice dimensions.
- A single-column game layout.

The HTML includes a viewport meta tag