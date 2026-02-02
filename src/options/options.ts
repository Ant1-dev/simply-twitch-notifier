import browser from 'webextension-polyfill';
import type { StorageData } from '../types';

// Get DOM elements
const keywordsTextarea = document.getElementById('keywords') as HTMLTextAreaElement;
const soundEnabledCheckbox = document.getElementById('soundEnabled') as HTMLInputElement;
const soundVolumeSlider = document.getElementById('soundVolume') as HTMLInputElement;
const volumeDisplay = document.getElementById('volumeDisplay') as HTMLSpanElement;
const saveButton = document.getElementById('save') as HTMLButtonElement;
const testSoundButton = document.getElementById('testSound') as HTMLButtonElement;
const statusDiv = document.getElementById('status') as HTMLDivElement;

/**
 * Load settings from storage and populate UI
 */
async function loadSettings() {
  const data = await browser.storage.sync.get(['keywords', 'soundEnabled', 'soundVolume']) as Partial<StorageData>;
  
  // Populate keywords (convert array to newline-separated string)
  keywordsTextarea.value = (data.keywords || []).join('\n');
  
  // Populate sound settings
  soundEnabledCheckbox.checked = data.soundEnabled ?? true;
  soundVolumeSlider.value = String(data.soundVolume ?? 0.5);
  updateVolumeDisplay();
}

/**
 * Save settings to storage
 */
async function saveSettings() {
  // Parse keywords (split by newline, trim, remove empty)
  const keywordLines = keywordsTextarea.value.split('\n');
  const keywords = keywordLines
    .map(line => line.trim())
    .filter(line => line.length > 0);
  
  const settings: StorageData = {
    keywords,
    soundEnabled: soundEnabledCheckbox.checked,
    soundVolume: parseFloat(soundVolumeSlider.value)
  };
  
  try {
    await browser.storage.sync.set(settings as unknown as Record<string, unknown>);
    showStatus('Settings saved!', false);
  } catch (error) {
    showStatus('Error saving settings', true);
    console.error('Save error:', error);
  }
}

/**
 * Update volume display text
 */
function updateVolumeDisplay() {
  const volume = parseFloat(soundVolumeSlider.value);
  volumeDisplay.textContent = `${Math.round(volume * 100)}%`;
}

/**
 * Test notification sound
 */
function testSound() {
  const volume = parseFloat(soundVolumeSlider.value);
  const audio = new Audio(browser.runtime.getURL('sounds/notification.mp3'));
  audio.volume = volume;
  audio.play().catch(err => {
    showStatus('Error playing sound', true);
    console.error('Sound error:', err);
  });
}

/**
 * Show status message
 */
function showStatus(message: string, isError: boolean) {
  statusDiv.textContent = message;
  statusDiv.className = isError ? 'status error' : 'status';
  
  // Clear status after 3 seconds
  setTimeout(() => {
    statusDiv.textContent = '';
  }, 3000);
}

// Event listeners
saveButton.addEventListener('click', saveSettings);
testSoundButton.addEventListener('click', testSound);
soundVolumeSlider.addEventListener('input', updateVolumeDisplay);

// Load settings on page load
loadSettings();