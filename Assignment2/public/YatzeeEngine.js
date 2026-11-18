// Yatzee Engine
"use strict";

const CATEGORIES = [
  { key: "ones", label: "Ones" },
  { key: "twos", label: "Twos" },
  { key: "threes", label: "Threes" },
  { key: "fours", label: "Fours" },
  { key: "fives", label: "Fives" },
  { key: "sixes", label: "Sixes" },
  { key: "threeKind", label: "Three of a Kind" },
  { key: "fourKind", label: "Four of a Kind" },
  { key: "smallStraight", label: "Small Straight" },
  { key: "largeStraight", label: "Large Straight" },
  { key: "fullHouse", label: "Full House" },
  { key: "yatzee", label: "Yatzee" },
  { key: "chance", label: "Chance" },
];


/**slice(0,6) will select the first 6 categories
 * map() creates an array containing only those keys
 * Result: "Ones", "Twos", etc
 * slice starts on the first number and ends on the last number
 * number is position in array
 * end number is not included
 */

const UPPER_KEYS = CATEGORIES.slice(0, 6).map(function (category){
  return category.key;
});

// will select remaining categories
// slice will select everything onwards in array starting with indicated position #
const LOWER_KEYS = CATEGORIES.slice(6).map(function (category){
  return category.key;
});



/** creating an array that will add all of the values into it
 * reduce() will combine the value into a single result. 
 * the final 0 is the starting rolll
 */

function sumArray(values) {
  return values.reduce(function (total, value){
    return total + value;
  }, 0);
  
}

/** counts how often each face up dice appears
 * index 0 counts ones
 * index 1 counts two, etc
 */

function countDiceValues(values){
  return values.reduce(function (counts, value){
    counts[value - 1]++;
    return counts;
  }, [0, 0, 0, 0, 0, 0]);
}

/** chcks whether if there are 5 face-up values that are valid (not 0) and the same
 * every makes sure each value MUST pass the test
 * 
 */

function isYatzee(values){
  return Array.isArray(values) &&
  values.length === 5 &&
  values.every(function (value) {
  return Number.isInteger(value) &&
  value >=1 &&
  value <=6 &&
  value === values[0];
});
}

//ACTUAL ENGINE
class YatzeeEngine {
  constructor() {
    this.reset();
  }
  /**
   * create an empty score table and clear any bonuses
   */

  reset() {
    this.scoreTable = {};
    this.yatzeeBonus = 0;

    for (const category of CATEGORIES) {
      this.scoreTable[category.key] = null;
    }
  }
  // dice values have to be exactly five integers between 1 and 6 inclusively
  validDice(values) {
    return (
      Array.isArray(values) &&
      values.length === 5 &&
      values.every(function (value) {
        return Number.isInteger(value) && value >= 1 && value <= 6;
      })
    );
  }

  /**jocker roll rules
   * yatzee bonus
   * same conditions as normal Yatzee but Yatzee category  has already been filled
   *
   */

  isJokerRoll(values) {
    return isYatzee(values) && this.scoreTable.yatzee !== null;
  }
  /*    check if it is valid scoring category & unused
   valid selection CAN be 0 points
   Yatzee bonus add restriction of should not be it
  
  */
  isValidSelection(category, values) {
    if (!this.validDice(values)) {
      return false;
    }

    const categoryExists = CATEGORIES.some(function (item) {
      return item.key === category;
    });

    if (!categoryExists) {
      return false;
    }
    if (this.scoreTable[category] !== null) {
      return false;
    }

    if (!this.isJokerRoll(values)) {
      return true;
    }

    // use upper if unfilled
    const matchingUpper = UPPER_KEYS[values[0] - 1];

    if (this.scoreTable[matchingUpper] === null) {
      return category === matchingUpper;
    }
    //use open lower category if bottom unfilled
    const lowerAvailable = LOWER_KEYS.some((key) => {
      return this.scoreTable[key] === null;
    });

    if (lowerAvailable) {
      return LOWER_KEYS.includes(category);
    }

    // if lower full then use a different upper category. upper section will be 0
    return UPPER_KEYS.includes(category);
  }
  // three of a kind score calculation. score should be sum of all dice
  calculateThreeOfAKindScore(values) {
    const counts = countDiceValues(values);

    return counts.some((count) => count >= 3) ? sumArray(values) : 0;
  }
  // four of a kind score calculation. score should be sum of all dice
  calculateFourOfAKindScore(values) {
    const counts = countDiceValues(values);

    return counts.some((count) => count >= 4) ? sumArray(values) : 0;
  }

  //calculate full house score. fixed score of 25 if valid
  // ? : is short hand if else statement

  calculateFullHouseScore(values) {
    const counts = countDiceValues(values);

    return counts.includes(3) && counts.includes(2) ? 25 : 0;
  }

  //calculate small straight score. removed duplicates & arranges number
  // join returns array as a string
  //.some return true if an alement in array satistfies tested funciton

  calculateSmallStraightScore(values) {
    const sequence = [...new Set(values)].sort((a, b) => a - b).join("");

    const straights = ["1234", "2345", "3456"];

    return straights.some((straight) => sequence.includes(straight)) ? 30 : 0;
  }

  // calculate large straight score. does not arrange because uses || which is or

  calculateLargeStraightScore(values) {
    const sequence = [...values].sort((a, b) => a - b).join("");

    return sequence === "12345" || sequence === "23456" ? 40 : 0;
  }

  /*    calculateScore(category, diceValues) calculates but does not record score  */
  calculateScore(category, values) {
    if (!this.validDice(values)) {
      return null;
    }
    const upperIndex = UPPER_KEYS.indexOf(category);

    if (upperIndex !== -1) {
      const face = upperIndex + 1;

      return values.reduce(function (total, value) {
        return total + (value === face ? value : 0);
      }, 0);
    }

    // fixed ""joker "" rules
    if (this.isJokerRoll(values)) {
      if (category === "fullHouse") return 25;
      if (category === "smallStraight") return 30;
      if (category === "largeStraight") return 40;
    }

    switch (category) {
      case "threeKind":
        return this.calculateThreeOfAKindScore(values);

      case "fourKind":
        return this.calculateFourOfAKindScore(values);

      case "fullHouse":
        return this.calculateFullHouseScore(values);

      case "smallStraight":
        return this.calculateSmallStraightScore(values);

      case "largeStraight":
        return this.calculateLargeStraightScore(values);

      case "yatzee":
        return isYatzee(values) ? 50 : 0;

      case "chance":
        return sumArray(values);

      default:
        return null;
    }
  }

  // should valideate, calculate and score the chosen score
  // will return true if recorded and false if rejeted.
  //additional bonus are added here so they are not repeated elsewwhere
  recordScore(category, values) {
    if (!this.isValidSelection(category, values)) {
      return false;
    }

    const score = this.calculateScore(category, values);

    if (score === null) {
      return false;
    }

    if (isYatzee(values) && this.scoreTable.yatzee === 50) {
      this.yatzeeBonus += 100;
    }

    this.scoreTable[category] = score;

    return true;
  }
  /**recording scores for upper 1 - 6. ?? treal null as zero  */
  getUpperSubtotal() {
    return UPPER_KEYS.reduce((total, key) => {
      return total + (this.scoreTable[key] ?? 0);
    }, 0);
  }

  //calculate upper bonus

  getUpperBonus() {
    return this.getUpperSubtotal() >= 63 ? 35 : 0;
  }

  getLowerSubtotal() {
    return LOWER_KEYS.reduce((total, key) => {
      return total + (this.scoreTable[key] ?? 0);
    }, 0);
  }

  getTotalScore() {
    return (
      this.getUpperSubtotal() +
      this.getUpperBonus() +
      this.getLowerSubtotal() +
      this.yatzeeBonus
    );
  }

  isComplete() {
    return CATEGORIES.every((category) => {
      return this.scoreTable[category.key] !== null;
    });
  }
}
    