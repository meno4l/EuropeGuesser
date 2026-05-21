# EuropeGuesser

EuropeGuesser is a polished React geography quiz app for learning European capitals, countries, flags, and map locations.

## Features

- First-time player setup with localStorage persistence
- Dashboard with score, accuracy, high score, quiz count, and streaks
- Capital, flag, map, and mixed challenge quiz modes
- Easy, medium, and hard difficulty settings
- Interactive responsive SVG Europe map
- Dark and light theme support
- Animated page and quiz transitions with Framer Motion
- Accessible buttons, labels, focus states, and ARIA-friendly quiz feedback

## Tech Stack

- React
- Vite
- Tailwind CSS
- Framer Motion
- React Router
- LocalStorage

## Setup

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the build:

```bash
npm run preview
```

## Project Structure

```text
src/
  components/
  data/
  hooks/
  pages/
  utils/
  styles/
```

## Notes

The app uses a local curated Europe dataset so quizzes work without an API. The SVG map is a simplified educational map focused on clear click targets and interaction rather than cartographic precision.
