# 🎯 Hangman Game

A modern, interactive hangman game built with React and Vite, featuring a programming-themed word list and progressive hangman drawings.


## ✨ Features

- **🎮 Interactive Gameplay**: Click letter buttons or use keyboard input
- **📱 Responsive Design**: Works on desktop and mobile devices
- **🎨 Modern UI**: Glassmorphism design with smooth animations
- **🏆 Scoring System**: Earn points for each completed word
- **🎭 Progressive Drawings**: 7-stage hangman progression with custom images
- **🔄 New Game**: Start fresh anytime with a new random word
- **🐳 Docker Support**: Easy deployment with containerization

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Docker (optional, for containerized deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd hangman
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Navigate to `http://localhost:5174/`
   - Start playing!

### Docker Deployment

1. **Build the Docker image**
   ```bash
   docker build -t hangman-game .
   ```

2. **Run the container**
   ```bash
   docker run -p 3000:3000 hangman-game
   ```

3. **Access the game**
   - Open `http://localhost:3000/` in your browser

## 🎯 How to Play

1. **Guess the Word**: A random programming-related word is selected
2. **Make Guesses**: Click letter buttons or type on your keyboard
3. **Track Progress**: Watch the hangman drawing progress with each wrong guess
4. **Win Condition**: Guess all letters before the drawing is complete (6 wrong guesses)
5. **Score Points**: Earn 10 points for each completed word
6. **New Game**: Click "New Game" to start over with a fresh word

### Game Rules

- **Maximum Wrong Guesses**: 6 attempts before game over
- **Word Categories**: Programming concepts, languages, and terms
- **Input Methods**: Mouse clicks or keyboard input
- **Scoring**: 10 points per completed word

## 🏗️ Project Structure

```
hangman/
├── public/
│   ├── images/          # Hangman drawing stages
│   │   ├── noose.png
│   │   ├── upperbody.png
│   │   ├── upperandlowerbody.png
│   │   ├── 1arm.png
│   │   ├── botharms.png
│   │   ├── 1leg.png
│   │   └── Dead.png
│   ├── favicon.ico
│   ├── manifest.json    # PWA configuration
│   └── robots.txt
├── src/
│   ├── components/      # React components
│   │   ├── HangmanDisplay.jsx
│   │   ├── WordDisplay.jsx
│   │   ├── GameStats.jsx
│   │   ├── LetterButtons.jsx
│   │   ├── GameMessage.jsx
│   │   └── HangmanGame.jsx
│   ├── constants.js     # Game configuration
│   ├── App.jsx          # Main app component
│   ├── App.css          # Global styles
│   └── main.jsx         # App entry point
├── Dockerfile           # Docker configuration
├── package.json         # Dependencies and scripts
├── vite.config.js       # Vite configuration
└── README.md           # This file
```

## 🎨 Customization

### Adding New Words

Edit `src/constants.js` to add words to the `WORDS` array:

```javascript
export const WORDS = [
  'JAVASCRIPT', 'PYTHON', 'COMPUTER', 'PROGRAMMING',
  'YOUR_NEW_WORD', // Add your word here
  // ... more words
];
```

### Modifying Game Settings

Update these constants in `src/constants.js`:

```javascript
export const MAX_WRONG_GUESSES = 6;  // Change difficulty
export const POINTS_PER_WIN = 10;    // Adjust scoring
```

### Styling Changes

Modify `src/App.css` to customize:
- Color scheme
- Layout dimensions
- Animation timings
- Responsive breakpoints

## 🛠️ Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Technologies Used

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **CSS3** - Styling with modern features
- **Docker** - Containerization
- **ESLint** - Code linting

### Component Architecture

The app follows a modular component structure:

- **`HangmanGame`** - Main game logic and state management
- **`HangmanDisplay`** - Shows current hangman stage
- **`WordDisplay`** - Displays word with blanks/letters
- **`GameStats`** - Shows score and wrong guesses
- **`LetterButtons`** - Interactive letter selection
- **`GameMessage`** - Win/loss notifications

## 📱 Progressive Web App (PWA)

This game includes PWA features for installation on mobile devices:

- **Web App Manifest**: Configured in `public/manifest.json`
- **Service Worker**: Automatic caching for offline play
- **Responsive Design**: Optimized for all screen sizes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- Hangman drawing images
- Programming word list inspiration
- React and Vite communities

---

**Enjoy playing Hangman! 🎉**

For questions or suggestions, feel free to open an issue or submit a pull request.