function getArray(scripts: string | string[]): string[] {
  let scriptsArray: string[] = [];
  if (typeof scripts === "string") {
    scriptsArray = [scripts];
  } else {
    scriptsArray = scripts;
  }
  return scriptsArray;
}

export default class Scripting {
  static async executeScripts(tabId: number, scripts: string | string[]) {
    await chrome.scripting.executeScript({
      files: getArray(scripts),
      target: { tabId },
    });
  }

  static async executeFunction<T>(tabId: number, cb: () => Promise<T>) {
    const result = await chrome.scripting.executeScript({
      target: { tabId },
      func: cb,
    });
    return result[0].result as T;
  }

  static async insertCss(tabId: number, cssFiles: string | string[]) {
    await chrome.scripting.insertCSS({
      files: getArray(cssFiles),
      target: { tabId },
    });
  }

  static async removeCss(tabId: number, cssFiles: string | string[]) {
    await chrome.scripting.removeCSS({
      files: getArray(cssFiles),
      target: { tabId },
    });
  }
}

export class ContentScriptModel {
  constructor(
    private scriptData: {
      script: string;
      matches: string[];
      id: string;
    }
  ) {}

  async upsertScript() {
    const script = await this.getScript();
    if (script) {
      await this.unregisterScript();
    }
    await this.registerScript();
  }

  async registerScript() {
    await chrome.scripting.registerContentScripts([
      {
        id: this.scriptData.id,
        js: [this.scriptData.script],
        matches: this.scriptData.matches,
        allFrames: true,
      },
    ]);
  }

  async unregisterScript() {
    await chrome.scripting.unregisterContentScripts({
      ids: [this.scriptData.id],
    });
  }

  async getScript(): Promise<
    chrome.scripting.RegisteredContentScript | undefined
  > {
    const scripts = await chrome.scripting.getRegisteredContentScripts({
      ids: [this.scriptData.id],
    });
    return scripts ? scripts[0] : undefined;
  }
}
