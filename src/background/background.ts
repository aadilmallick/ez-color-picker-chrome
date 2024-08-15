import { Runtime } from "../utils/api/runtime";
import { onColorPick } from "./dynamicScripts";
import { openEyedropperChannel } from "./messageHandlers";
import { storage } from "./storageHandlers";

Runtime.onInstall({
  // runs first time you download the extension
  installCb: async () => {
    console.log("Extension installed");
  },
  // runs every time you update the extension or refresh it
  updateCb: async () => {
    console.log("Extension updated");
  },
  onAll: async () => {
    console.log("Extension loaded");
    storage.setup();
  },
});

openEyedropperChannel.listen(({ tabId, url }) => {
  onColorPick(tabId, url);
});
