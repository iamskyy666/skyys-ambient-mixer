import { sounds, defaultPresets } from "./soundData.js";
import { SoundManager } from "./soundManager.js";
import { UI } from "./ui.js";

class AmbientMixer {
  // Initialize dependancies and default state
  constructor() {
    this.soundManager = new SoundManager();
    this.ui = new UI();
    this.timer = null;
    this.currentSoundState = {};
    this.isInitialized = false;
  }

  init() {
    try {
      // Initialize UI
      this.ui.init();

      // Render sound cards using our sound data
      this.ui.renderSoundCards(sounds);

      // Load all sound files
      this.loadAllSounds();
      this.soundManager.loadSound("rain", "audio/rain.mp3");
      this.isInitialized = true;
    } catch (error) {
      console.log("❌ Failed to initialize app:", error);
    }
  }

  // Load all sound files
  loadAllSounds() {
    sounds.forEach((sound) => {
      const audioURL = `audio/${sound}`;
      const success = this.soundManager.loadSound(sound.id, audioURL);
      if (!success) {
        console.log(`Cound not load sound: ${sound.name} from ${audioURL}`);
      }
    });
  }
}

// Initialize app when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const app = new AmbientMixer();
  app.init();

  // Make app available for testing in browser, globally.
  // window.app = app;
});
