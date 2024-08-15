import {
  activateEyeDropperChannel,
  storeColorChannel,
} from "../background/messageHandlers";
import EyedropperManager from "../utils/vanillajsutils/EyedropperManager";
import { ToastManager } from "../utils/vanillajsutils/Toast";

function getRandomRGBColor() {
  return `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(
    Math.random() * 256
  )}, ${Math.floor(Math.random() * 256)})`;
}

document.body.style.backgroundColor = getRandomRGBColor();
console.log("runtim", chrome.runtime);

const eyedropperManager = new EyedropperManager();
const toastManager = new ToastManager();
toastManager.setup();
console.log("toast element", document.querySelector("#toasts"));

// activateEyeDropperChannel.listen(({ url }) => {
setTimeout(() => {
  handleColorPick(window.location.href);
}, 750);
// });

async function handleColorPick(url: string) {
  const color = await eyedropperManager.getColor();
  if (color) {
    toastManager.success(`Color: ${color}`);
    storeColorChannel.sendC2P({ color, url });
  } else {
    toastManager.danger("Could not get color");
  }
}
