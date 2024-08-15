import {
  openEyedropperChannel,
  storeColorChannel,
} from "../background/handlers";
import EyedropperManager from "../utils/vanillajsutils/EyedropperManager";
import { ToastManager } from "../utils/vanillajsutils/Toast";

const eyedropperManager = new EyedropperManager();
const toaster = new ToastManager({
  position: "top-right",
});
toaster.setup();

openEyedropperChannel.listen(({ url }) => {
  console.log("open-eyedropper channel received");
  // setTimeout is used to prevent the eye dropper from closing. The popup must be closed beforehand
  setTimeout(() => {
    handleColorPick(url);
  }, 750);
});

async function handleColorPick(url: string) {
  const color = await eyedropperManager.getColor();
  if (color) {
    toaster.success("Color picked!");
    storeColorChannel.sendC2P({ url, color });
  }
}
