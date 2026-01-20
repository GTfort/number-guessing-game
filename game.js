const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const gradient = require("gradient-string");

class NumberGuessingGame {
  constructor() {
    this.secretNumber = 0;
    this.attempts = 0;
    this.maxAttempts = 10;
    this.difficulty = "medium";
    this.gameStarted = false;
    this.gameOver = false;
    this.guesses = [];
    this.startTime = null;
    this.endTime = null;
    this.scoresFile = path.join(__dirname, "scores.json");
    this.highScores = this.loadHighScores();
  }

  // Generate random number between min and max (inclusive)
  generateRandomNumber(min = 1, max = 100) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Set difficulty level
  setDifficulty(level) {
    const difficultySettings = {
      easy: { maxAttempts: 10, range: [1, 50] },
      medium: { maxAttempts: 5, range: [1, 100] },
      hard: { maxAttempts: 3, range: [1, 200] },
      expert: { maxAttempts: 1, range: [1, 1000] },
    };

    const settings = difficultySettings[level] || difficultySettings.medium;
    this.difficulty = level;
    this.maxAttempts = settings.maxAttempts;
    this.secretNumber = this.generateRandomNumber(...settings.range);
    this.attempts = 0;
    this.guesses = [];
    this.gameStarted = true;
    this.gameOver = false;
    this.startTime = Date.now();

    return {
      maxAttempts: settings.maxAttempts,
      range: settings.range,
    };
  }

  // Make a guess
  makeGuess(guess) {
    if (!this.gameStarted || this.gameOver) {
      throw new Error("Game is not active");
    }

    this.attempts++;
    const guessNum = parseInt(guess);
    this.guesses.push(guessNum);

    // Check if guess is correct
    if (guessNum === this.secretNumber) {
      this.endTime = Date.now();
      this.gameOver = true;

      // Calculate score
      const score = this.calculateScore();

      // Save high score
      this.saveHighScore(score);

      return {
        correct: true,
        message: this.getWinMessage(),
        attempts: this.attempts,
        score: score,
        time: this.getGameTime(),
      };
    }

    // Provide hint
    const hint = guessNum < this.secretNumber ? "higher" : "lower";
    const attemptsLeft = this.maxAttempts - this.attempts;

    // Check if game is over
    if (attemptsLeft <= 0) {
      this.endTime = Date.now();
      this.gameOver = true;
      return {
        correct: false,
        message: this.getLoseMessage(),
        hint: null,
        attemptsLeft: 0,
        secretNumber: this.secretNumber,
      };
    }

    // Provide feedback
    const distance = Math.abs(guessNum - this.secretNumber);
    let feedback = "";

    if (distance > 50) feedback = "You're freezing cold! ❄️";
    else if (distance > 30) feedback = "You're cold! 🥶";
    else if (distance > 15) feedback = "You're warm! 😊";
    else if (distance > 5) feedback = "You're hot! 🔥";
    else feedback = "You're on fire! 🔥🔥";

    return {
      correct: false,
      message: `Incorrect! The number is ${hint} than ${guessNum}.`,
      hint: `${feedback} (${hint})`,
      attemptsLeft: attemptsLeft,
      previousGuesses: this.guesses,
    };
  }

  // Calculate score based on difficulty and attempts
  calculateScore() {
    if (!this.gameOver || this.attempts === 0) return 0;

    const difficultyMultiplier = {
      easy: 1,
      medium: 2,
      hard: 5,
      expert: 10,
    };

    const timeTaken = this.getGameTime(); // in seconds
    const timeBonus = Math.max(0, 300 - timeTaken); // Max 5 minutes
    const attemptsBonus = (this.maxAttempts - this.attempts + 1) * 100;
    const multiplier = difficultyMultiplier[this.difficulty] || 1;

    return Math.round((attemptsBonus + timeBonus) * multiplier);
  }

  // Get game time in seconds
  getGameTime() {
    if (!this.startTime || !this.endTime) return 0;
    return Math.round((this.endTime - this.startTime) / 1000);
  }

  // Get win message
  getWinMessage() {
    const time = this.getGameTime();
    const messages = [
      `🎉 ${gradient.rainbow("UNBELIEVABLE!")} You got it in ${this.attempts} ${this.attempts === 1 ? "try" : "tries"}! 🤯`,
      `🏆 ${gradient.passion("CHAMPION!")} Perfect guess in ${this.attempts} attempts! 🥇`,
      `✨ ${gradient.fruit("AMAZING!")} You found the number in ${this.attempts} guesses! 🌟`,
      `✅ ${gradient.mind("GREAT JOB!")} Correct in ${this.attempts} ${this.attempts === 1 ? "attempt" : "attempts"}! 🎯`,
      `👍 ${gradient.retro("WELL DONE!")} You guessed it in ${this.attempts} tries! 🎊`,
    ];

    const message = messages[Math.floor(Math.random() * messages.length)];

    if (time < 10) {
      return `${message} And you did it in only ${time} seconds! ⚡`;
    } else if (time < 30) {
      return `${message} Completed in ${time} seconds! 🚀`;
    } else {
      return `${message} It took you ${time} seconds. ⏱️`;
    }
  }

  // Get lose message
  getLoseMessage() {
    const messages = [
      `😔 ${gradient.rainbow("GAME OVER!")} The number was ${this.secretNumber}. Better luck next time!`,
      `💔 ${gradient.passion("SO CLOSE!")} The secret number was ${this.secretNumber}. Don't give up!`,
      `🤦 ${gradient.fruit("OUT OF ATTEMPTS!")} It was ${this.secretNumber}. Try again!`,
      `🙈 ${gradient.mind("MISSED IT!")} The number was ${this.secretNumber}. Want another go?`,
      `👻 ${gradient.retro("BETTER LUCK NEXT TIME!")} The answer was ${this.secretNumber}.`,
    ];

    return messages[Math.floor(Math.random() * messages.length)];
  }

  // Get hint (reduces max attempts)
  getHint() {
    if (!this.gameStarted || this.gameOver) {
      throw new Error("Game is not active");
    }

    // Penalty for using hint
    this.maxAttempts = Math.max(1, this.maxAttempts - 1);

    const hints = [
      `The number is ${this.secretNumber % 2 === 0 ? "even" : "odd"}.`,
      `The number is between ${Math.max(1, this.secretNumber - 20)} and ${Math.min(200, this.secretNumber + 20)}.`,
      `The sum of digits is ${String(this.secretNumber)
        .split("")
        .reduce((sum, digit) => sum + parseInt(digit), 0)}.`,
      `The number is ${this.secretNumber > 50 ? "greater than 50" : "50 or less"}.`,
      `The number ${this.secretNumber % 3 === 0 ? "is" : "is not"} divisible by 3.`,
    ];

    return {
      hint: hints[Math.floor(Math.random() * hints.length)],
      penalty: `You lost 1 attempt for using a hint. ${this.maxAttempts} attempts remaining.`,
    };
  }

  // Reset game
  reset() {
    this.secretNumber = 0;
    this.attempts = 0;
    this.maxAttempts = 10;
    this.difficulty = "medium";
    this.gameStarted = false;
    this.gameOver = false;
    this.guesses = [];
    this.startTime = null;
    this.endTime = null;
  }

  // High score management
  loadHighScores() {
    try {
      if (fs.existsSync(this.scoresFile)) {
        const data = fs.readFileSync(this.scoresFile, "utf8");
        return JSON.parse(data);
      }
    } catch (error) {
      console.error("Error loading high scores:", error);
    }
    return {};
  }

  saveHighScore(score) {
    if (!this.difficulty || !score) return;

    const key = this.difficulty;

    if (!this.highScores[key] || score > this.highScores[key].score) {
      this.highScores[key] = {
        score: score,
        attempts: this.attempts,
        time: this.getGameTime(),
        date: new Date().toISOString(),
      };

      try {
        fs.writeFileSync(
          this.scoresFile,
          JSON.stringify(this.highScores, null, 2),
        );
      } catch (error) {
        console.error("Error saving high score:", error);
      }
    }
  }

  getHighScores() {
    return this.highScores;
  }

  // Statistics
  getStats() {
    return {
      currentGame: {
        difficulty: this.difficulty,
        attempts: this.attempts,
        maxAttempts: this.maxAttempts,
        guesses: this.guesses,
        gameTime: this.getGameTime(),
        gameStarted: this.gameStarted,
        gameOver: this.gameOver,
      },
      highScores: this.highScores,
    };
  }
}

module.exports = NumberGuessingGame;
