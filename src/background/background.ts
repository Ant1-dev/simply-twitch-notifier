import browser from 'webextension-polyfill';
import type { KeywordMatchMessage, StorageData } from '../types';

/**
 * Listen for messages from content script
 */
browser.runtime.onMessage.addListener(async (message: unknown) => {
  if (typeof message === 'object' && message !== null && (message as any).type === 'KEYWORD_MATCH') {
    await handleKeywordMatch(message as KeywordMatchMessage);
  }
});

/**
 * Handle keyword match: show notification
 */
async function handleKeywordMatch(data: KeywordMatchMessage) {
  // Create desktop notification
  await browser.notifications.create({
    type: 'basic',
    iconUrl: browser.runtime.getURL('icons/icon-128.png'),
    title: `Keyword "${data.keyword}" in ${data.channel}'s chat`,
    message: `${data.username}: ${data.message}`,
    priority: 2
  });
}

/**
 * Open options page when toolbar icon is clicked
 * Use action API (MV3) with fallback to browserAction (MV2)
 */
const actionApi = (browser as any).action || browser.browserAction;
if (actionApi?.onClicked) {
  actionApi.onClicked.addListener(() => {
    browser.runtime.openOptionsPage();
  });
}

/**
 * Set default settings on install
 */
browser.runtime.onInstalled.addListener(async () => {
  const existing = await browser.storage.sync.get(['keywords', 'soundEnabled', 'soundVolume']) as Partial<StorageData>;

  // Only set defaults if not already set
  const defaults: StorageData = {
    keywords: existing.keywords || [],
    soundEnabled: existing.soundEnabled ?? true,
    soundVolume: existing.soundVolume ?? 0.5
  };

  await browser.storage.sync.set(defaults as unknown as Record<string, unknown>);
});
