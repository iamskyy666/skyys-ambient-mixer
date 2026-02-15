<img width="956" height="474" alt="image" src="https://github.com/user-attachments/assets/56e91efb-5ae1-474a-a187-2f3b04b99ef4" />
<img width="927" height="421" alt="image" src="https://github.com/user-attachments/assets/89daa6fb-a530-44d9-b4b7-a105e3661520" />
<img width="958" height="469" alt="image" src="https://github.com/user-attachments/assets/e8d26f38-480f-44c5-b167-7a79503fa67c" />



# 🎧 Skyy’s Ambient Mixer

**Skyy’s Ambient Mixer** is a browser-based ambient sound mixer that lets users create, save, and manage custom soundscapes for focus, relaxation, and sleep. It features layered looping audio, fine-grained volume control, presets, timers, and persistent settings — all built with vanilla JavaScript and modern UI patterns.

---

## ✨ Features

### 🔊 Sound Mixing

* Multiple looping ambient sounds
* Individual volume sliders per sound
* Real-time volume visualization
* Smooth play / pause per sound

### 🎚️ Master Controls

* Global master volume slider
* Play / pause all sounds
* Full reset to default state

### ⭐ Presets

* Built-in default presets
* **Custom presets**

  * Save current mix
  * Persisted in `localStorage`
  * Loaded automatically on startup
  * One-click activation
  * Delete with inline UI control

### ⏱️ Sleep / Focus Timer

* Optional countdown timer
* Automatically stops playback when time ends
* Live timer display

### 🌗 Theme Toggle

* Light / dark theme switch
* Instant UI update
* Icon state synced with theme

---

## 🧱 Architecture

The app is modular and organized for clarity and scalability:

### Core Classes

* **`AmbientMixer`** – App controller, event orchestration, state management
* **`SoundManager`** – Audio loading, playback, looping, volume control
* **`PresetManager`** – Save/load/delete custom presets using `localStorage`
* **`UI`** – DOM rendering, UI updates, modal handling
* **`Timer`** – Countdown logic and callbacks

### State Management

* Centralized `currentSoundState`
* Master volume scaling applied dynamically
* UI always synced with actual audio state

---

## 💾 Persistence

* Custom presets are stored in the browser via `localStorage`
* Presets survive page reloads
* Duplicate preset names are prevented
* Only active sounds are saved per preset

---

## 🖱️ UX Highlights

* Event delegation for performance
* Modal-based preset saving
* Visual feedback for active sounds and presets
* Hover-based delete controls
* Defensive checks to prevent invalid actions

---

## 🚀 Tech Stack

* **Vanilla JavaScript (ES Modules)**
* **HTML5 Audio API**
* **Tailwind-based utility styling**
* **Font Awesome icons**
* **LocalStorage API**

No frameworks. No dependencies. Fast and lightweight.

---

## 📌 Project Status

Skyyy’s Ambient Mixer is **fully functional** and ready for extension.
Possible future enhancements include:

* Export / import presets
* Preset categories
* Mobile-specific UI tweaks
* Crossfade transitions
* Cloud sync

---
