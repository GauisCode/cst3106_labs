"use strict";
class YatzeeDice {
  constructor(numberOfDice = 5) {
    this.numberOfDice = numberOfDice;
    this.reset();
  }

  async rollAvailable() {
    try {
      const response = await fetch("/roll-dices");

      if (!response.ok) {
        throw new Error("The server could not roll the dice.");
      }

      const serverDiceValues = await response.json();

      for (let index = 0; index < this.numberOfDice; index++) {
        if (!this.held[index]) {
          this.values[index] = serverDiceValues[index];
        }
      }

      return true;
    } catch (error) {
      console.error("Dice roll failed:", error);
      return false;
    }
  }
  /* changes the state of a singular die
will reverse teh boolean.
*/
  toggleHold(index) {
    this.held[index] = !this.held[index];
  }

  /*creates a new array for the dice value and held state
zero for ones that were not rolled... yet because it is not a possible result
if the fill value is false then none of the dice are being held. They are all availalbe to roll.
*/
  reset() {
    this.values = new Array(this.numberOfDice).fill(0);
    this.held = new Array(this.numberOfDice).fill(false);
  }
}