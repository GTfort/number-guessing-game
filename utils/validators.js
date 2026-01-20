const chalk = require("chalk");

class Validators {
  static isValidNumber(input, min = 1, max = 100) {
    const num = parseInt(input);

    if (isNaN(num)) {
      return {
        valid: false,
        message: chalk.red("Please enter a valid number"),
      };
    }

    if (num < min || num > max) {
      return {
        valid: false,
        message: chalk.red(`Please enter a number between ${min} and ${max}`),
      };
    }

    return {
      valid: true,
      value: num,
    };
  }

  static isValidDifficulty(choice) {
    const difficulties = [
      "1",
      "2",
      "3",
      "4",
      "easy",
      "medium",
      "hard",
      "expert",
    ];

    if (!difficulties.includes(choice.toLowerCase())) {
      return {
        valid: false,
        message: chalk.red(
          "Please select a valid difficulty (1-4 or easy/medium/hard/expert)",
        ),
      };
    }

    // Map input to standard difficulty
    const mapping = {
      1: "easy",
      2: "medium",
      3: "hard",
      4: "expert",
      easy: "easy",
      medium: "medium",
      hard: "hard",
      expert: "expert",
    };

    return {
      valid: true,
      value: mapping[choice.toLowerCase()],
    };
  }

  static isValidCommand(input) {
    const commands = [
      "hint",
      "quit",
      "exit",
      "restart",
      "stats",
      "help",
      "scores",
    ];

    if (commands.includes(input.toLowerCase())) {
      return {
        valid: true,
        isCommand: true,
        command: input.toLowerCase(),
      };
    }

    // Check if it's a number
    const numValidation = this.isValidNumber(input, 1, 1000);
    if (numValidation.valid) {
      return {
        valid: true,
        isCommand: false,
        value: numValidation.value,
      };
    }

    return {
      valid: false,
      message: chalk.red(
        "Invalid input. Enter a number or command (hint/quit/stats/help)",
      ),
    };
  }

  static isValidPlayAgain(input) {
    const positive = ["y", "yes", "yeah", "yep", "sure", "ok", "1"];
    const negative = ["n", "no", "nah", "nope", "exit", "quit", "2"];

    const normalized = input.toLowerCase().trim();

    if (positive.includes(normalized)) {
      return {
        valid: true,
        playAgain: true,
      };
    }

    if (negative.includes(normalized)) {
      return {
        valid: true,
        playAgain: false,
      };
    }

    return {
      valid: false,
      message: chalk.red("Please enter yes (y) or no (n)"),
    };
  }

  static isInRange(guess, min, max) {
    return guess >= min && guess <= max;
  }

  static hasSpecialCharacters(input) {
    // Allow numbers and basic punctuation
    return /[^a-zA-Z0-9\s\-\_\.\,]/.test(input);
  }
}

module.exports = Validators;
