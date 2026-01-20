# Number Guessing Game 🎯

A fun, interactive CLI number guessing game with multiple difficulty levels, scoring system, and statistics tracking.

## 🚀 Features

- **🎮 Multiple Difficulty Levels**: Easy, Medium, Hard, Expert
- **🏆 Scoring System**: Points based on speed and attempts
- **📊 Statistics Tracking**: Win rates, streaks, high scores
- **💡 Hint System**: Get clues (with a penalty)
- **📈 Visual Feedback**: Progress bars, number line visualization
- **🎨 Beautiful Terminal UI**: Colors, gradients, and ASCII art
- **🔄 Replayability**: Play multiple rounds with persistent stats

## 📦 Installation

### Global Installation

```bash
npm install -g number-guessing-game
Manual Setup
bash
git clone <your-repo-url>
cd number-guessing-game
npm install
npm link
🎮 How to Play
Start the Game
bash
guess-number
Game Commands
text
🎯 <number>    : Make a guess
💡 hint        : Get a clue (costs 1 attempt)
📊 stats       : Show game statistics
🏆 scores      : View high scores
🔄 restart     : Start a new game
❌ quit/exit   : End the game
Difficulty Levels
Easy: 10 attempts, numbers 1-50

Medium: 5 attempts, numbers 1-100

Hard: 3 attempts, numbers 1-200

Expert: 1 attempt, numbers 1-1000

🏆 Scoring System
Your score is calculated based on:

Attempts: Fewer attempts = higher score

Time: Faster guesses = time bonus

Difficulty: Higher difficulty = multiplier

Hints: Using hints reduces maximum score

📊 Example Gameplay
text
🎮 NUMBER GUESSING GAME 🎮

📜 GAME RULES:
────────────────────────────────────────
• The computer will pick a random number between 1-100
• You have limited attempts based on difficulty level
• After each guess, you'll get "higher/lower" hints
• Use hints wisely (they cost 1 attempt)

🎚️ SELECT DIFFICULTY:
────────────────────────────────────────
1. Easy   → 10 attempts, number 1-50
2. Medium → 5 attempts, number 1-100
3. Hard   → 3 attempts, number 1-200
4. Expert → 1 attempt, number 1-1000

Enter your choice (1-4): 2

🎮 GAME STARTED!
────────────────────────────────────────
Difficulty: MEDIUM
Range: 1 to 100
Attempts: 5
────────────────────────────────────────
💡 Type "hint" for a clue (costs 1 attempt)
💡 Type "quit" to end the game

Progress: [░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░] 0/5 attempts used

🎯 Guess 1/5: 50
✖ Incorrect! The number is less than 50.
💡 You're hot! 🔥 (lower)
Attempts left: 4

Number Line:
(1)                                               (100)
························G───────────S·················
G = Your Guess  S = Secret Number

🎯 Guess 2/5: 25
✅ Congratulations! You guessed the correct number in 2 attempts!

📊 Game Statistics:
──────────────────────
Attempts: 2
Time: 15 seconds
Score: 850 points
🛠️ Development
Project Structure
text
number-guessing-game/
├── index.js              # Main CLI entry point
├── game.js               # Core game logic
├── utils/
│   ├── display.js        # Terminal display
│   ├── stats.js          # Statistics tracking
│   └── validators.js     # Input validation
├── scores.json          # High scores data
└── game-stats.json     # Player statistics
Running Tests
bash
npm test
Building for Distribution
bash
npm publish
🎯 Tips for Success
Start with Medium: Best balance of challenge and playability

Use Binary Search: Guess in the middle of the range

Save Hints: Use them when you're really stuck

Watch the Timer: Faster guesses earn bonus points

Build Streaks: Consecutive wins multiply your score

🤝 Contributing
Contributions are welcome! Here's how:

Fork the repository

Create a feature branch

Make your changes

Add tests if applicable

Submit a pull request

Areas for Improvement
Add multiplayer mode

Implement daily challenges

Create achievement system

Add sound effects (where supported)

Implement AI opponent

📝 License
MIT License - see LICENSE file for details

🙏 Acknowledgments
Inspired by classic number guessing games

Built for CLI game enthusiasts

Thanks to all contributors and testers

Happy Guessing! 🎯

May your guesses be lucky and your scores be high!
```
