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

      this.setUpEventListeners();

      // Load all sound files
      this.loadAllSounds();
      this.soundManager.loadSound("rain", "audio/rain.mp3");
      this.isInitialized = true;
    } catch (error) {
      console.log("❌ Failed to initialize app:", error);
    }
  }

  // Setup all event listeners
  setUpEventListeners() {
    // Handle all clicks with evt-delegation
    document.addEventListener("click", async (evt) => {
      // Check if a play-btn. was clicked
      if (evt.target.closest(".play-btn")) {
        const soundId = evt.target.closest(".play-btn").dataset.sound;
        // console.log(soundId);
        await this.toggleSound(soundId);
      }
    });

    // Handle volume-slider changes
    document.addEventListener("input", (evt) => {
      if (evt.target.classList.contains("volume-slider")) {
        const soundId = evt.target.dataset.sound;
        const volume = parseInt(evt.target.value);
        // console.log(soundId, ":", volume);
        this.setSoundVolume(soundId, volume);
      }
    });
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

  // Toggle individual sound
  async toggleSound(soundId) {
    const audio = this.soundManager.audioElements.get(soundId);

    if (!audio) {
      console.log(`⚠️ Sound ${soundId} not found!`);
      return false;
    }

    if (audio.paused) {
      // get current slider val.
      const card = document.querySelector(`[data-sound="${soundId}"]`);
      const slider = card.querySelector(".volume-slider");

      let volume = parseInt(slider.value);

      // if slider is at 0, default to 5️⃣%
      if (volume === 0) {
        volume = 50;
        this.ui.updateVolumeDisplay(soundId, volume);
      }

      // sound is off, we wanna turn it on
      this.soundManager.setVolume(soundId, 50);
      await this.soundManager.playSound(soundId);
      this.ui.updateSoundPlayButton(soundId, true);
    } else {
      // sound is on, we wanna shut it off
      this.soundManager.pauseSound(soundId);
      this.ui.updateSoundPlayButton(soundId, false);
    }
  }

  // Set sound vol.
  setSoundVolume(soundId, volume) {
    // Update sound vol. in manager
    this.soundManager.setVolume(soundId, volume);

    // Update vol. UI-display
    this.ui.updateVolumeDisplay(soundId, volume);
  }
}

// Initialize app when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const app = new AmbientMixer();
  app.init();

  // Make app available for testing in browser, globally.
  // window.app = app;
});
