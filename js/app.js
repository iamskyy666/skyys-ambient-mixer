import { sounds, defaultPresets } from "./soundData.js";

class AmbientMixer {
  // Initialize dependancies and default state
  constructor() {
    console.log("Initializing state... ✅");
    this.soundManager = null;
    this.ui = null;
    this.ui = null;
    this.timer = null;
    this.currentSoundState = {};
    this.isInitialized = false;
  }

  init() {
    try {
      console.log("Initializing app... ☑️");
      this.isInitialized = true;
    } catch (error) {
      console.log("❌ Failed to initialize app:", error);
    }
  }
}

// Initialize app when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const app = new AmbientMixer();
  app.init();
});
