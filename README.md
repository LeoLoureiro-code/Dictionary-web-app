# Dictionary Web App

Vanilla JavaScript dictionary application built to practice state management, DOM rendering, and API consumption without using frameworks. The app allows users to search for words and dynamically fetch definitions, phonetics, audio, and examples from an external API.

---

## Overview

### The challenge

Users should be able to:

- Search for words using the input field
- See definitions, phonetics, and examples from the API
- Play pronunciation audio when available
- See a validation message when submitting an empty input
- See an error UI when no definitions are found
- Switch between serif, sans-serif, and monospace fonts
- Switch between light and dark themes
- View a responsive layout depending on screen size
- See hover and focus states for interactive elements

---

### Screenshot

![App Screenshot](./screenshots/screenshot.png)

---

### Links

- Solution URL: https://github.com/LeoLoureiro-code/Dictionary-web-app
- Live Site URL: https://leoloureiro-code.github.io/Dictionary-web-app/

---

## My Process

### Built with

- Semantic HTML5
- CSS custom properties (variables)
- Flexbox & CSS Grid
- Vanilla JavaScript (no frameworks)
- State-based UI rendering
- Fetch API for external data

---

### What I learned

This project helped reinforce key frontend concepts without relying on frameworks:

- How to manage global state manually:
  
```
const State = {
  loading: false,
  error: false,
  errorMessage: "",
  wordInformation: {}
};

- Separating concerns between logic and UI:

// Logic
State.loading = true;

// UI
Render();

- Building a render system based on state conditions:

if (State.loading) {
  RenderLoading();
} else if (State.error) {
  RenderError();
} else {
  RenderWordInformation();
}
```
