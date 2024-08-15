import { Runtime } from "../utils/api/runtime";
import { Handler, storage, storeColorChannel } from "./handlers";

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

storeColorChannel.listen(({ url, color }) => {
  Handler.saveColorToStorage(color, url);
});
