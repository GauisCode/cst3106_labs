// Yatzee game

class YatzeeGame {
  constructor() {
    this.dice = new YatzeeDice();
    this.engine = new YatzeeEngine();
    this.startNewGame();
  }

  /*
    Initialize or restart the game.
  */
  startNewGame() {
    this.currentPlayer = "Player 1";
    this.currentRound = 1;
    this.rollCount = 0;
    this.totalScore = 0;
    this.gameOver = false;

    this.dice.reset();
    this.engine.reset();

    this.message = "Roll the dice to begin.";
  }
  /*
    rollDice()
    A successful roll updates values and increases rollCount.
  */
  async rollDice() {
    if (this.gameOver || this.rollCount >= 3) {
      return;
    }

    if (this.dice.held.every((value) => value)) {
      this.message = "Release a die to reroll, or select a score.";
      return;
    }

   const rollSucceeded = await this.dice.rollAvailable();

   if (!rollSucceeded) {
     this.message = "Unable to roll dice. Check that the server is running.";
     return;
   }

   this.rollCount++;

    this.message =
      this.rollCount === 3
        ? "Three rolls used. Choose a score to finish your turn."
        : "Hold dice, roll again, or choose a score.";

    if (this.engine.isJokerRoll(this.dice.values)) {
      this.message +=
        " Joker rules apply; only allowed categories are enabled.";
    }
  }

  /*
    holdDie(index)

    Holding is available after the first roll and before game ends.
    The Dice object performs the actual held-state change.
  */
  holdDie(index) {
    if (!this.gameOver && this.rollCount > 0) {
      this.dice.toggleHold(index);
    }
  }

  /*
    scoreCategory(category)
    checks that a turns starts tehn asks engine to record score, updates the total then ends the turn
  */
  scoreCategory(category) {
    if (this.gameOver || this.rollCount === 0) {
      return;
    }

    const scoreRecorded = this.engine.recordScore(category, this.dice.values);

    if (!scoreRecorded) {
      this.message = "That category cannot be selected.";
      return;
    }

    this.totalScore = this.engine.getTotalScore();
    this.endTurn();
  }

  /*
    endTurn()

    A valid category being selected ends the

    If every category is used up then it ends the game.
    Otherwise, ti moves to the next rounds
  */
  endTurn() {
    if (this.engine.isComplete()) {
      this.endGame();
      return;
    }

    this.currentRound++;
    this.rollCount = 0;
    this.dice.reset();

    this.message = "Score recorded. Roll to start your next turn.";
  }

  /*
    endGame()

    Marks the game finished and prepares a final-score message.

    The UI reads gameOver to disable game controls.
  */
  endGame() {
    this.gameOver = true;
    this.totalScore = this.engine.getTotalScore();

    this.message =
      "Game complete! Your final score is " +
      this.totalScore +
      ". Select New Game to play again.";
  }
}
