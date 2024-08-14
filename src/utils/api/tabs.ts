// requires tab permission

interface TabAudio {
  toggleMuted(tab: chrome.tabs.Tab): Promise<void>;
  getMuted(tab: chrome.tabs.Tab): Promise<boolean>;
}
export class Tabs {
  static async getCurrentTab() {
    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });
    return tab;
  }

  static async getTabById(tabId: number) {
    return await chrome.tabs.get(tabId);
  }

  static async moveTab(tabId: number, index: number) {
    return await chrome.tabs.move(tabId, { index });
  }

  static async reloadTab(tabId: number) {
    await chrome.tabs.reload(tabId);
  }

  static async deleteTabs(tabIds: number[]) {
    await chrome.tabs.remove(tabIds);
  }

  /**
   * Gets all tabs from the current window, or a different window if you specify the windowId
   */
  static async getAllTabs(windowId?: number) {
    return await chrome.tabs.query({ windowId });
  }

  static Audio: TabAudio = {
    async toggleMuted(tab: chrome.tabs.Tab) {
      if (!tab.id) throw new Error("Tab id not found");
      await chrome.tabs.update(tab.id, {
        muted: tab.mutedInfo?.muted ? false : true,
      });
    },

    async getMuted(tab: chrome.tabs.Tab) {
      if (!tab.id) throw new Error("Tab id not found");
      return tab.mutedInfo?.muted ?? false;
    },
  };

  static Zoom = {
    async setZoom(tabId: number, zoomFactor: number) {
      await chrome.tabs.setZoom(tabId, zoomFactor);
    },
    async resetZoom(tabId: number) {
      await chrome.tabs.setZoom(tabId, 0);
    },
  };
}

export class TabModel {
  public tab?: chrome.tabs.Tab;
  public audio = Tabs.Audio;
  static instance: TabModel | null = null;
  constructor(options: chrome.tabs.CreateProperties) {
    if (TabModel.instance) return TabModel.instance;
    TabAPI.createTab(options).then((tab) => {
      this.tab = tab;
      this.audio.getMuted = this.audio.getMuted.bind(null, this.tab);
      this.audio.toggleMuted = this.audio.toggleMuted.bind(null, this.tab);
      TabModel.instance = this;
    });
  }

  async moveToIndex(index: number) {
    if (!this.tab?.id) return;
    await chrome.tabs.move(this.tab.id, { index });
  }

  async remove() {
    if (!this.tab?.id) return;
    await chrome.tabs.remove(this.tab.id);
  }
}

export class TabAPI {
  /**
   * when url of the current tab is updated
   */
  static onTabUpdated = chrome.tabs.onUpdated.addListener.bind(
    chrome.tabs.onUpdated
  );

  /**
   * when a tab is created
   */
  static onTabCreated = chrome.tabs.onCreated.addListener.bind(
    chrome.tabs.onCreated
  );

  /**
   * when a user navigates to a new tab
   */
  static onTabActivated = chrome.tabs.onActivated.addListener.bind(
    chrome.tabs.onActivated
  );

  static createTab = chrome.tabs.create.bind(chrome.tabs);
}
