export const Runtime = {
  onExtensionLoaded(callback: () => void) {
    chrome.runtime.onInstalled.addListener(callback);
  },

  onCleanup(callback: () => void) {
    chrome.runtime.onSuspend.addListener(callback);
  },

  onInstall({
    installCb,
    updateCb,
    chromeUpdateCb,
    onExtensionUnInstalledUrl,
  }: {
    installCb?: () => void;
    updateCb?: () => void;
    chromeUpdateCb?: () => void;
    onExtensionUnInstalledUrl?: string;
  }) {
    chrome.runtime.onInstalled.addListener(({ reason }) => {
      switch (reason) {
        case chrome.runtime.OnInstalledReason.INSTALL:
          onExtensionUnInstalledUrl &&
            chrome.runtime.setUninstallURL(onExtensionUnInstalledUrl);
          installCb?.();
          break;
        case chrome.runtime.OnInstalledReason.UPDATE:
          updateCb?.();
          break;
        case chrome.runtime.OnInstalledReason.CHROME_UPDATE:
          chromeUpdateCb?.();
          break;
      }
    });
  },
  openOptionsPage: chrome.runtime.openOptionsPage.bind(chrome.runtime),
  getUrl: chrome.runtime.getURL.bind(chrome.runtime),
};
