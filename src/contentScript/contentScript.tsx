import {
  openEyedropperChannel,
  storeColorChannel,
} from "../background/handlers";
import EyedropperManager from "../utils/vanillajsutils/EyedropperManager";

const eyedropperManager = new EyedropperManager();

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
    storeColorChannel.sendC2P({ url, color });
  }
}
