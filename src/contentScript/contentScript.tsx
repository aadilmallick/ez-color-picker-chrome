import {
  openEyedropperChannel,
  storeColorChannel,
} from "../background/handlers";

const abortController = new AbortController();

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    abortController.abort();
  }
});

openEyedropperChannel.listen(({ url }) => {
  console.log("open-eyedropper channel received");
  // setTimeout is used to prevent the eye dropper from closing
  setTimeout(() => {
    handleColorPick(url);
  }, 500);
});

async function handleColorPick(url: string) {
  if (!window.EyeDropper) {
    return;
  }
  const eyeDropper = new window.EyeDropper();
  const result = await eyeDropper.open({
    signal: abortController.signal,
  });
  console.log(result);
  storeColorChannel.sendC2P({ url, color: result.sRGBHex });
}
