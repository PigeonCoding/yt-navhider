'use strict';

const ACTIVE_ICON = 'icons/icon.svg';
const INACTIVE_ICON = 'icons/icon-off.svg';

function updateIcon(enabled) {
  browser.action.setIcon({ path: enabled ? ACTIVE_ICON : INACTIVE_ICON });
  browser.action.setTitle({
    title: enabled
      ? 'YouTube Nav Hider: on (click to disable)'
      : 'YouTube Nav Hider: off (click to enable)',
  });
}

browser.action.onClicked.addListener(async () => {
  const { enabled = true } = await browser.storage.local.get('enabled');
  await browser.storage.local.set({ enabled: !enabled });
});

browser.storage.local.get('enabled').then(({ enabled = true }) => updateIcon(enabled));
browser.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.enabled) {
    updateIcon(changes.enabled.newValue);
  }
});
