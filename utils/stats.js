const fs = require("fs");
const path = require("path");

class GameStats {
  constructor() {
    this.statsFile = path.join(__dirname, "../game-stats.json");
    this.stats = this.loadStats();
  }

  loadStats() {
    try {
      if (fs.existsSync(this.statsFile)) {
        const data = fs.readFileSync(this.statsFile, "utf8");
        return JSON.parse(data);
      }
    } catch (error) {
      console.error("Error loading stats:", error);
    }

    // Default stats structure
    return {
      totalGames: 0,
      gamesWon: 0,
      gamesLost: 0,
      totalAttempts: 0,
      totalScore: 0,
      averageScore: 0,
      bestScore: 0,
      byDifficulty: {},
      streak: {
        current: 0,
        best: 0,
      },
      playTime: 0, // in seconds
    };
  }

  saveStats() {
    try {
      fs.writeFileSync(this.statsFile, JSON.stringify(this.stats, null, 2));
    } catch (error) {
      console.error("Error saving stats:", error);
    }
  }

  recordGame(result) {
    const { difficulty, won, attempts, score, time } = result;

    // Update overall stats
    this.stats.totalGames++;
    if (won) {
      this.stats.gamesWon++;
      this.stats.streak.current++;
      if (this.stats.streak.current > this.stats.streak.best) {
        this.stats.streak.best = this.stats.streak.current;
      }
    } else {
      this.stats.gamesLost++;
      this.stats.streak.current = 0;
    }

    this.stats.totalAttempts += attempts;
    this.stats.totalScore += score;
    this.stats.playTime += time;

    if (score > this.stats.bestScore) {
      this.stats.bestScore = score;
    }

    this.stats.averageScore =
      Math.round(this.stats.totalScore / this.stats.gamesWon) || 0;

    // Update difficulty-specific stats
    if (!this.stats.byDifficulty[difficulty]) {
      this.stats.byDifficulty[difficulty] = {
        games: 0,
        wins: 0,
        bestScore: 0,
        averageScore: 0,
        totalScore: 0,
      };
    }

    const diffStats = this.stats.byDifficulty[difficulty];
    diffStats.games++;
    if (won) diffStats.wins++;
    diffStats.totalScore += score;
    diffStats.averageScore =
      Math.round(diffStats.totalScore / diffStats.wins) || 0;

    if (score > diffStats.bestScore) {
      diffStats.bestScore = score;
    }

    this.saveStats();
  }

  getStats() {
    return {
      ...this.stats,
      winRate:
        Math.round((this.stats.gamesWon / this.stats.totalGames) * 100) || 0,
      averageAttempts:
        Math.round(this.stats.totalAttempts / this.stats.totalGames) || 0,
      averageTime: Math.round(this.stats.playTime / this.stats.totalGames) || 0,
    };
  }

  displayStats() {
    const stats = this.getStats();

    console.log(chalk.bold.cyan("\n📈 GAME STATISTICS"));
    console.log(chalk.dim("═".repeat(50)));

    console.log(chalk.bold.yellow("\nOverall:"));
    console.log(chalk.dim("─".repeat(30)));
    console.log(chalk.green(`Total Games: ${stats.totalGames}`));
    console.log(chalk.green(`Games Won: ${stats.gamesWon}`));
    console.log(chalk.green(`Games Lost: ${stats.gamesLost}`));
    console.log(chalk.cyan(`Win Rate: ${stats.winRate}%`));
    console.log(chalk.cyan(`Current Streak: ${stats.streak.current}`));
    console.log(chalk.cyan(`Best Streak: ${stats.streak.best}`));
    console.log(chalk.yellow(`Best Score: ${stats.bestScore}`));
    console.log(chalk.yellow(`Average Score: ${stats.averageScore}`));
    console.log(chalk.yellow(`Average Attempts: ${stats.averageAttempts}`));
    console.log(
      chalk.yellow(
        `Total Play Time: ${Math.round(stats.playTime / 60)} minutes`,
      ),
    );

    if (Object.keys(stats.byDifficulty).length > 0) {
      console.log(chalk.bold.magenta("\nBy Difficulty:"));
      console.log(chalk.dim("─".repeat(30)));

      Object.entries(stats.byDifficulty).forEach(([difficulty, diffStats]) => {
        const winRate =
          Math.round((diffStats.wins / diffStats.games) * 100) || 0;
        console.log(chalk.bold.cyan(`\n${difficulty.toUpperCase()}:`));
        console.log(chalk.green(`Games: ${diffStats.games}`));
        console.log(chalk.green(`Wins: ${diffStats.wins} (${winRate}%)`));
        console.log(chalk.yellow(`Best Score: ${diffStats.bestScore}`));
        console.log(chalk.yellow(`Average Score: ${diffStats.averageScore}`));
      });
    }

    console.log(chalk.dim("═".repeat(50)));
  }

  resetStats() {
    this.stats = {
      totalGames: 0,
      gamesWon: 0,
      gamesLost: 0,
      totalAttempts: 0,
      totalScore: 0,
      averageScore: 0,
      bestScore: 0,
      byDifficulty: {},
      streak: {
        current: 0,
        best: 0,
      },
      playTime: 0,
    };
    this.saveStats();
    console.log(chalk.green("✅ Statistics reset successfully"));
  }
}

module.exports = GameStats;
