import browser from 'webextension-polyfill';
import type { StorageData, KeywordMatchMessage } from '../types';

// Cache keywords and settings in memory
let keywords: string[] = [];
let soundEnabled = true;
let soundVolume = 0.5;

/**
 * Initialize: Load keywords from storage when script starts
 */
async function init() {
  const data = await browser.storage.sync.get(['keywords', 'soundEnabled', 'soundVolume']) as Partial<StorageData>;
  keywords = data.keywords || [];
  soundEnabled = data.soundEnabled ?? true;
  soundVolume = data.soundVolume ?? 0.5;

  // Listen for storage changes (when user updates settings in options)
  browser.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'sync') {
      if (changes.keywords) {
        keywords = Array.isArray(changes.keywords.newValue) ? changes.keywords.newValue : [];
      }
      if (changes.soundEnabled) {
        soundEnabled = (changes.soundEnabled.newValue as boolean) ?? true;
      }
      if (changes.soundVolume) {
        soundVolume = (changes.soundVolume.newValue as number) ?? 0.5;
      }
    }
  });

  // Start observing chat
  observeChat();
}

/**
 * Find and observe the Twitch chat container
 */
function observeChat() {
  // Twitch chat messages live in this container
  const chatContainer = document.querySelector('.chat-scrollable-area__message-container');
  
  if (!chatContainer) {
    // Chat not loaded yet, try again in 1 second
    setTimeout(observeChat, 1000);
    return;
  }
  
  // MutationObserver watches for DOM changes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      // Check if new nodes were added
      mutation.addedNodes.forEach((node) => {
        if (node instanceof HTMLElement) {
          checkMessage(node);
        }
      });
    });
  });
  
  // Start observing: watch for child nodes being added
  observer.observe(chatContainer, {
    childList: true,  // Watch for added/removed children
    subtree: false    // Don't watch nested children (messages are direct children)
  });
}

/**
 * Check if a chat message contains any keywords
 */
function checkMessage(messageElement: HTMLElement) {
  // Extract username
  const usernameElement = messageElement.querySelector('.chat-author__display-name');
  const username = usernameElement?.textContent?.trim() || 'Unknown';
  
  // Extract message text
  const messageTextElement = messageElement.querySelector('[data-a-target="chat-line-message-body"]');
  const messageText = messageTextElement?.textContent?.trim() || '';
  
  if (!messageText) return;
  
  // Check if message contains any keyword (case-insensitive)
  const lowerMessage = messageText.toLowerCase();
  const matchedKeyword = keywords.find(keyword => 
    lowerMessage.includes(keyword.toLowerCase())
  );
  
  if (matchedKeyword) {
    // Get current channel from URL
    const channel = window.location.pathname.split('/')[1] || 'Unknown';

    // Play sound if enabled (content script handles audio since service workers can't)
    if (soundEnabled) {
      playNotificationSound();
    }

    // Send notification request to background script
    const message: KeywordMatchMessage = {
      type: 'KEYWORD_MATCH',
      keyword: matchedKeyword,
      message: messageText,
      username: username,
      channel: channel
    };

    browser.runtime.sendMessage(message);
  }
}

/**
 * Play notification sound
 */
function playNotificationSound() {
  const audio = new Audio(browser.runtime.getURL('sounds/notification.mp3'));
  audio.volume = soundVolume;
  audio.play().catch(err => {
    console.error('Failed to play notification sound:', err);
  });
}

// Start the extension
init();