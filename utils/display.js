const chalk = require("chalk");
const gradient = require("gradient-string");
const figlet = require("figlet");

class Display {
  static showTitle() {
    console.clear();

    figlet.text(
      "Number Guesser",
      {
        font: "Big",
        horizontalLayout: "default",
        verticalLayout: "default",
      },
      (err, data) => {
        if (err) {
          console.log(gradient.rainbow("\n🎮 NUMBER GUESSING GAME 🎮\n"));
          return;
        }
        console.log(gradient.passion(data));
      },
    );

    console.log(
      gradient.mind("\nCan you guess the secret number? Test your luck! 🎯\n"),
    );
  }

  static showRules() {
    console.log(chalk.bold.cyan("\n📜 GAME RULES:"));
    console.log(chalk.dim("─".repeat(50)));
    console.log(
      chalk.yellow("• The computer will pick a random number between 1-100"),
    );
    console.log(
      chalk.yellow("• You have limited attempts based on difficulty level"),
    );
    console.log(
      chalk.yellow('• After each guess, you\'ll get "higher/lower" hints'),
    );
    console.log(chalk.yellow("• Use hints wisely (they cost 1 attempt)"));
    console.log(chalk.yellow("• Your score depends on speed and few attempts"));
    console.log(chalk.dim("─".repeat(50)));
  }

  static showDifficultyOptions() {
    console.log(chalk.bold.magenta("\n🎚️  SELECT DIFFICULTY:"));
    console.log(chalk.dim("─".repeat(50)));
    console.log(
      chalk.green("1. Easy") + chalk.dim("   → 10 attempts, number 1-50"),
    );
    console.log(
      chalk.yellow("2. Medium") + chalk.dim(" → 5 attempts, number 1-100"),
    );
    console.log(
      chalk.red("3. Hard") + chalk.dim("   → 3 attempts, number 1-200"),
    );
    console.log(
      chalk.red.bold("4. Expert") + chalk.dim(" → 1 attempt, number 1-1000"),
    );
    console.log(chalk.dim("─".repeat(50)));
  }

  static showGameInfo(difficulty, maxAttempts, range) {
    console.log(chalk.bold.green("\n🎮 GAME STARTED!"));
    console.log(chalk.dim("─".repeat(50)));
    console.log(chalk.cyan(`Difficulty: ${difficulty.toUpperCase()}`));
    console.log(chalk.cyan(`Range: ${range[0]} to ${range[1]}`));
    console.log(chalk.cyan(`Attempts: ${maxAttempts}`));
    console.log(chalk.dim("─".repeat(50)));
    console.log(
      chalk.yellow.bold('\n💡 Type "hint" for a clue (costs 1 attempt)'),
    );
    console.log(chalk.yellow.bold('💡 Type "quit" to end the game'));
    console.log(chalk.dim("─".repeat(50)));
  }

  static showGuessResult(result) {
    if (result.correct) {
      console.log(gradient.fruit("\n" + "═".repeat(60)));
      console.log(gradient.rainbow("  " + result.message));
      console.log(gradient.fruit("═".repeat(60)));

      console.log(chalk.bold.cyan("\n📊 Game Statistics:"));
      console.log(chalk.dim("─".repeat(30)));
      console.log(chalk.yellow(`Attempts: ${result.attempts}`));
      console.log(chalk.yellow(`Time: ${result.time} seconds`));
      console.log(chalk.green.bold(`Score: ${result.score} points`));
    } else {
      console.log(chalk.red("\n✖ " + result.message));
      if (result.hint) {
        console.log(chalk.yellow("💡 " + result.hint));
      }
      console.log(chalk.cyan(`Attempts left: ${result.attemptsLeft}`));

      if (result.previousGuesses && result.previousGuesses.length > 0) {
        console.log(
          chalk.dim(`Previous guesses: ${result.previousGuesses.join(", ")}`),
        );
      }
    }
  }

  static showHighScores(scores) {
    if (Object.keys(scores).length === 0) {
      console.log(
        chalk.yellow("\n📭 No high scores yet. Play a game to set one!"),
      );
      return;
    }

    console.log(chalk.bold.cyan("\n🏆 HIGH SCORES"));
    console.log(chalk.dim("═".repeat(60)));

    Object.entries(scores).forEach(([difficulty, score]) => {
      const date = new Date(score.date).toLocaleDateString();
      console.log(chalk.bold.magenta(`\n${difficulty.toUpperCase()}:`));
      console.log(chalk.dim("─".repeat(30)));
      console.log(chalk.yellow(`Score: ${score.score} points`));
      console.log(chalk.yellow(`Attempts: ${score.attempts}`));
      console.log(chalk.yellow(`Time: ${score.time} seconds`));
      console.log(chalk.dim(`Date: ${date}`));
    });

    console.log(chalk.dim("═".repeat(60)));
  }

  static showGameOver(secretNumber) {
    console.log(chalk.bold.red("\n" + "═".repeat(60)));
    console.log(chalk.red.bold("💀 GAME OVER 💀"));
    console.log(chalk.red(`The secret number was: ${secretNumber}`));
    console.log(chalk.bold.red("═".repeat(60)));
  }

  static showProgressBar(attempts, maxAttempts, width = 30) {
    const percentage = (attempts / maxAttempts) * 100;
    const filledWidth = Math.round((width * percentage) / 100);
    const bar = "█".repeat(filledWidth) + "░".repeat(width - filledWidth);

    let color = chalk.green;
    if (percentage > 66) color = chalk.red;
    else if (percentage > 33) color = chalk.yellow;

    console.log(
      color(`\nProgress: [${bar}] ${attempts}/${maxAttempts} attempts used`),
    );
  }

  static showNumberVisualization(guess, secret, maxWidth = 50) {
    const min = Math.min(guess, secret);
    const max = Math.max(guess, secret);
    const range = max - min;

    if (range === 0) return;

    const scale = maxWidth / range;
    const guessPos = Math.round((guess - min) * scale);
    const secretPos = Math.round((secret - min) * scale);

    let visualization = "";
    for (let i = 0; i <= maxWidth; i++) {
      if (i === guessPos) {
        visualization += chalk.bold.red("G");
      } else if (i === secretPos) {
        visualization += chalk.bold.green("S");
      } else if (
        i > Math.min(guessPos, secretPos) &&
        i < Math.max(guessPos, secretPos)
      ) {
        visualization += chalk.yellow("─");
      } else {
        visualization += chalk.dim("·");
      }
    }

    console.log(chalk.dim("\nNumber Line:"));
    console.log(chalk.dim(`(${min})` + " ".repeat(maxWidth - 3) + `(${max})`));
    console.log(visualization);
    console.log(
      chalk.red("G = Your Guess") + "  " + chalk.green("S = Secret Number"),
    );
  }
}

module.exports = Display;
