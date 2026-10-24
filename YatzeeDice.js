"use strict";
class YatzeeDice {
  constructor(numberOfDice = 5) {
    this.numberOfDice = 5;
    this.reset();   
  }

  /*
    roll() Returns one random integer between 1 and 6.
  */
  roll() {
    return Math.floor(Math.random() * 6) + 1;
  }


  /*
    for each dice, checks the state creates new value if the value is false
    if the state held by the visited dice is true, then it keeps the current value
  */
  rollAvailable() {
    for (let index = 0; index < this.numberOfDice; index++) {
      if (!this.held[index]){
        this.value[index] = this.roll;
      }
    }
  }
/* changes the state of a singular die
will reverse teh boolean.
*/
  toggleHold(index){
    this.held[index] = !this.held[index];
  }

/*creates a new array for the dice value and held state
zero for ones that were not rolled... yet because it is not a possible result
if the fill value is false then none of the dice are being held. They are all being rolled.
*/
  reset(){
    this.value = new Array(this.numberOfDice).fill(0);
    this.held = new Array(this.numberOfDice).fill(false);
  }
}