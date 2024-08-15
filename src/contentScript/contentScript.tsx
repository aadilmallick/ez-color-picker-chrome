import {
  openEyedropperChannel,
  storeColorChannel,
} from "../background/handlers";
import { ToastManager } from "../utils/Toast";

const toaster = new ToastManager();

openEyedropperChannel.listen(({ url }) => {
  console.log("open-eyedropper channel received");
  // setTimeout is used to prevent the eye dropper from closing
  setTimeout(() => {
    handleColorPick(url);
  }, 750);
});

window.addEventListener("DOMContentLoaded", () => {
  toaster.setup();
});

async function handleColorPick(url: string) {
  if (!window.EyeDropper) {
    return;
  }
  try {
    const eyeDropper = new window.EyeDropper();
    const { sRGBHex } = await eyeDropper.open();
    toaster.success(`Color picked: ${sRGBHex}`);
    storeColorChannel.sendC2P({ url, color: sRGBHex });
  } catch (error) {
    console.error(error);
    console.log("Error getting color");
  }
}
