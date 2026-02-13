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
    this.masterVolume = 100;
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

      // Initialize sound states after loading sounds
      sounds.forEach((sound) => {
        this.currentSoundState[sound.id] = 0;
      });

      this.isInitialized = true;
    } catch (error) {
      console.log("❌ Failed to initialize app:", error);
    }
  }

  // Setup all event listeners 🖱️
  setUpEventListeners() {
    // Handle all clicks with evt-delegation
    document.addEventListener("click", async (evt) => {
      // Check if a play-btn. was clicked
      if (evt.target.closest(".play-btn")) {
        const soundId = evt.target.closest(".play-btn").dataset.sound;
        await this.toggleSound(soundId);
      }

      // Check if a default preset-btn. was clicked
      if (evt.target.closest(".preset-btn")) {
        const presetKey = evt.target.closest(".preset-btn").dataset.preset;
        this.loadPreset(presetKey);
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

    // Handle master-volume slider 🎚️
    const masterVolumeSlider = document.getElementById("masterVolume");
    if (masterVolumeSlider) {
      masterVolumeSlider.addEventListener("input", (e) => {
        const volume = parseInt(e.target.value);
        this.setMasterVolume(volume);
      });
    }

    // Handle masster play/pause btn.
    if (this.ui.playPauseButton) {
      this.ui.playPauseButton.addEventListener("click", () => {
        this.toggleAllSounds();
      });
    }

    // Handle reset btn.
    if (this.ui.resetButton) {
      this.ui.resetButton.addEventListener("click", () => {
        this.resetAll();
      });
    }
  }

  // Load all sound files
  loadAllSounds() {
    sounds.forEach((sound) => {
      const audioURL = `audio/${sound.file}`;
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

      // if slider is at 0, default to 5️⃣0️⃣%
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

    // update main play btn state
    this.updateMainPlayButtonState();
  }

  // Toggle all sounds
  toggleAllSounds() {
    if (this.soundManager.isPlaying) {
      // toggle sounds OFF
      this.soundManager.pauseAll();
      this.ui.updateMainPlayButton(false);
      sounds.forEach((sound) => {
        this.ui.updateSoundPlayButton(sound.soundId);
      });
    } else {
      // toggle sounds ON
      for (const [soundId, audio] of this.soundManager.audioElements) {
        const card = document.querySelector(`[data-sound="${soundId}"]`);
        const slider = card?.querySelector(".volume-slider");
        if (slider) {
          let volume = parseInt(slider.value);

          if (volume === 0) {
            volume = 50;
            slider.value = 50;
            this.ui.updateVolumeDisplay(soundId, 50);
          }
          this.currentSoundState[soundId] = volume;

          const effectiveVol = (volume * this.masterVolume) / 100;
          audio.volume = effectiveVol / 100;
          this.ui.updateSoundPlayButton(soundId, true);
        }
      }

      // Play all sounds
      this.soundManager.playAll();
      this.ui.updateMainPlayButton(true);
    }
  }

  // Set sound vol.
  setSoundVolume(soundId, volume) {
    // Set sound vol. in state
    this.currentSoundState[soundId] = volume;
    // console.log(this.currentSoundState); // keeps track of our state{}

    // Calculate effective vol. with master-volume.
    const effectiveVol = (volume * this.masterVolume) / 100;

    // Update sound vol. with the scaled volume
    const audio = this.soundManager.audioElements.get(soundId);

    if (audio) {
      audio.volume = effectiveVol / 100;
    }

    // Update vol. UI-display
    this.ui.updateVolumeDisplay(soundId, volume);

    // Sync sounds
    this.updateMainPlayButtonState();
  }

  // Set master vol.
  setMasterVolume(volume) {
    this.masterVolume = volume;

    // update display
    const masterVolumeValue = document.getElementById("masterVolumeValue");
    if (masterVolumeValue) {
      masterVolumeValue.textContent = `${volume}%`;
    }

    // Apply master volumne to all curr. playing sounds
    this.applyMasterVolumeToAll();
  }

  // Apply master vol. to all playing sounds
  applyMasterVolumeToAll() {
    for (const [soundId, audio] of this.soundManager.audioElements) {
      if (!audio.paused) {
        const card = document.querySelector(`[data-sound="${soundId}"]`);
        const slider = card?.querySelector(".volume-slider");

        if (slider) {
          const indiVidualVol = parseInt(slider.value);

          // Calculate effective vol. (individual * master / 100)
          const effectiveVol = (indiVidualVol * this.masterVolume) / 100;

          // Apply to the actual audio element
          audio.volume = effectiveVol / 100;
        }
      }
    }
  }

  // Update main play-btn based on individual sounds
  updateMainPlayButtonState() {
    // Check if any sounds playing
    let anySoundsPlaying = false;
    for (const [soundId, audio] of this.soundManager.audioElements) {
      if (!audio.paused) {
        anySoundsPlaying = true;
        break;
      }
    }

    // Update the main btn and the internal state
    this.soundManager.isPlaying = anySoundsPlaying;
    this.ui.updateMainPlayButton(anySoundsPlaying);
  }

  // Reset everything to default state 💯
  resetAll() {
    // Stop all sounds
    this.soundManager.stopAll();

    // Reset the master-vol.
    this.masterVolume = 100;

    // Reset sound states
    sounds.forEach((sound) => {
      this.currentSoundState[sound.id] = 0;
    });

    // Reset UI
    this.ui.resetUi();

    // console.log(`All sounds and settings reset ☑️`);
  }

  // Load a preset config.
  loadPreset(presetKey) {
    const preset = defaultPresets[presetKey];
    if (!preset) {
      console.error(`☑️ Preset ${presetKey} not found!`);
      return;
    }
    // First =, stop all sounds
    this.soundManager.stopAll();

    // Reset all volumes to 0
    sounds.forEach((sound) => {
      this.currentSoundState[sound.id] = 0;
      this.ui.updateVolumeDisplay(sound.id, 0);
      this.ui.updateSoundPlayButton(sound.id, false);
    });

    // Apply the preset volumes
    for (const [soundId, volume] of Object.entries(preset.sounds)) {
      // Set volume state
      this.currentSoundState[soundId] = volume;

      // Update UI
      this.ui.updateVolumeDisplay(soundId, volume);

      // Calculate effective vol.
      const effectiveVol = (volume * this.masterVolume) / 100;

      // Get audio element and set value
      const audio = this.soundManager.audioElements.get(soundId);
      if (audio) {
        audio.volume = effectiveVol / 100;

        // Play sound
        audio.play();
        this.ui.updateSoundPlayButton(soundId, true);
      }
    }

    // Update main play-btn and state
    this.soundManager.isPlaying = true;
    this.ui.updateMainPlayButton(true);
  }
}

// Initialize app. when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const app = new AmbientMixer();
  app.init();

  // Make app available for testing in browser, globally.
  // window.app = app;
});
