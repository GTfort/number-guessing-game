#!/usr/bin/env node

const readline = require("readline");
const chalk = require("chalk");
const gradient = require("gradient-string");
const NumberGuessingGame = require("./game");
const Display = require("./utils/display");
const GameStats = require("./utils/stats");
const Validators = require("./utils/validators");

// Create interfaces
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Initialize game and stats
const game = new NumberGuessingGame();
const stats = new GameStats();

class GameCLI {
  constructor() {
    this.isPlaying = false;
  }

  // Show welcome screen
  async showWelcome() {
    Display.showTitle();
    Display.showRules();

    await this.pressToContinue("Press Enter to start the game...");
    this.selectDifficulty();
  }

  // Wait for user to press a key
  pressToContinue(prompt) {
    return new Promise((resolve) => {
      rl.question(chalk.yellow(`\n${prompt}`), () => {
        resolve();
      });
    });
  }

  // Select difficulty level
  async selectDifficulty() {
    Display.showDifficultyOptions();

    rl.question(
      chalk.bold.cyan("\nEnter your choice (1-4): "),
      async (choice) => {
        const validation = Validators.isValidDifficulty(choice);

        if (!validation.valid) {
          console.log(validation.message);
          await this.selectDifficulty();
          return;
        }

        const difficulty = validation.value;
        const settings = game.setDifficulty(difficulty);

        console.log(
          chalk.green.bold(
            `\n🎮 Great! You selected ${difficulty.toUpperCase()} difficulty.`,
          ),
        );
        console.log(
          chalk.yellow(
            `You have ${settings.maxAttempts} attempts to guess a number between ${settings.range[0]} and ${settings.range[1]}.`,
          ),
        );

        await this.pressToContinue("Press Enter to begin guessing...");
        this.startGame();
      },
    );
  }

  // Start the main game loop
  startGame() {
    this.isPlaying = true;
    Display.showGameInfo(game.difficulty, game.maxAttempts, [1, 100]);

    this.askForGuess();
  }

  // Ask for user's guess
  askForGuess() {
    if (!this.isPlaying || game.gameOver) return;

    const attemptsLeft = game.maxAttempts - game.attempts;
    Display.showProgressBar(game.attempts, game.maxAttempts);

    rl.question(
      chalk.bold.green(`\n🎯 Guess ${game.attempts + 1}/${game.maxAttempts}: `),
      (input) => {
        this.processInput(input);
      },
    );
  }

  // Process user input
  async processInput(input) {
    const validation = Validators.isValidCommand(input);

    if (!validation.valid) {
      console.log(validation.message);
      this.askForGuess();
      return;
    }

    if (validation.isCommand) {
      await this.handleCommand(validation.command);
    } else {
      this.handleGuess(validation.value);
    }
  }

  // Handle special commands
  async handleCommand(command) {
    switch (command) {
      case "hint":
        try {
          const hint = game.getHint();
          console.log(chalk.cyan.bold("\n💡 HINT:"), hint.hint);
          console.log(chalk.yellow(hint.penalty));
        } catch (error) {
          console.log(chalk.red(error.message));
        }
        this.askForGuess();
        break;

      case "quit":
      case "exit":
        console.log(chalk.yellow("\n👋 Thanks for playing!"));
        this.isPlaying = false;
        this.playAgain();
        break;

      case "stats":
        stats.displayStats();
        this.askForGuess();
        break;

      case "scores":
        Display.showHighScores(game.getHighScores());
        this.askForGuess();
        break;

      case "help":
        this.showHelp();
        this.askForGuess();
        break;

      case "restart":
        console.log(chalk.yellow("\n🔄 Restarting game..."));
        game.reset();
        this.selectDifficulty();
        break;
    }
  }

  // Handle number guess
  handleGuess(guess) {
    try {
      const result = game.makeGuess(guess);
      Display.showGuessResult(result);

      // Show visualization
      if (!result.correct && game.secretNumber) {
        Display.showNumberVisualization(guess, game.secretNumber);
      }

      if (result.correct) {
        // Record win
        stats.recordGame({
          difficulty: game.difficulty,
          won: true,
          attempts: game.attempts,
          score: result.score,
          time: result.time,
        });

        this.isPlaying = false;
        this.playAgain();
      } else if (result.attemptsLeft === 0) {
        // Record loss
        stats.recordGame({
          difficulty: game.difficulty,
          won: false,
          attempts: game.attempts,
          score: 0,
          time: game.getGameTime(),
        });

        Display.showGameOver(game.secretNumber);
        this.isPlaying = false;
        this.playAgain();
      } else {
        this.askForGuess();
      }
    } catch (error) {
      console.log(chalk.red("❌ Error:"), error.message);
      this.askForGuess();
    }
  }

  // Show help menu
  showHelp() {
    console.log(chalk.bold.cyan("\n🆘 HELP MENU"));
    console.log(chalk.dim("─".repeat(50)));
    console.log(chalk.yellow("🎯 Enter a number between 1-100 to guess"));
    console.log(chalk.yellow('💡 Type "hint" for a clue (costs 1 attempt)'));
    console.log(chalk.yellow('📊 Type "stats" to see your game statistics'));
    console.log(chalk.yellow('🏆 Type "scores" to view high scores'));
    console.log(chalk.yellow('🔄 Type "restart" to start a new game'));
    console.log(chalk.yellow('❌ Type "quit" or "exit" to end the game'));
    console.log(chalk.dim("─".repeat(50)));
  }

  // Ask to play again
  async playAgain() {
    console.log(chalk.cyan("\n" + "═".repeat(50)));

    rl.question(
      chalk.bold.magenta("\n🔄 Play again? (yes/no): "),
      async (answer) => {
        const validation = Validators.isValidPlayAgain(answer);

        if (!validation.valid) {
          console.log(validation.message);
          await this.playAgain();
          return;
        }

        if (validation.playAgain) {
          console.log(chalk.green("\n🎮 Starting new game...\n"));
          game.reset();
          await this.selectDifficulty();
        } else {
          console.log(gradient.rainbow("\n🎉 Thanks for playing! 🎉"));
          console.log(chalk.dim("\nFinal Statistics:"));
          stats.displayStats();
          console.log(chalk.cyan("\n👋 Goodbye! See you next time!\n"));
          rl.close();
          process.exit(0);
        }
      },
    );
  }

  // Start the game
  async start() {
    try {
      await this.showWelcome();
    } catch (error) {
      console.error(chalk.red("❌ Error:"), error.message);
      rl.close();
      process.exit(1);
    }
  }
}

// Handle CTRL+C gracefully
rl.on("SIGINT", () => {
  console.log(chalk.yellow("\n\n👋 Thanks for playing! Goodbye!\n"));
  rl.close();
  process.exit(0);
});

// Start the game
const gameCLI = new GameCLI();
gameCLI.start();
