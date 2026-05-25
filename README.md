# Task List App

A responsive task tracker built with Next.js, React, and TypeScript. The app lets you create tasks, start a timer for the active task, finish it, and delete completed tasks. Tasks are saved in the browser with `localStorage`, so they remain available after refreshing the page.

## Features

- Add new tasks from the input field or by pressing `Enter`
- Move tasks through `Pending`, `In progress`, and `Done` states
- Track elapsed time for the active task
- Save tasks locally in the browser
- Responsive layout for mobile, tablet, and desktop screens

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4 setup
- Plain CSS for the task UI

## Project Structure

```text
src/
  app/
    layout.tsx
    page.tsx
    globals.css
  components/
    Card.tsx
  constants/
    appConstants.ts
  hooks/
    uselocarstorage.ts
    usetasks.ts
  styles/
    card.css
  types/
    cardprops.ts
    task.ts
```

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

```bash
npm run dev
```

Starts the local development server.

```bash
npm run build
```

Creates a production build.

```bash
npm run start
```

Starts the production server after building the app.

```bash
npm run lint
```

Runs ESLint to check the project.

## Notes

Task data is stored in the browser using `localStorage`. Clearing browser storage will remove the saved tasks.
