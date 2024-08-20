import Scripting from "../utils/api/scripting";
import { delay } from "../utils/patternUtils";
import toastCss from "../utils/styleUtils/toast.css?raw";
import { Handler } from "./storageHandlers";
// import scriptPath from "../contentScript/main-world-loader?script";

async function onColorPickExecuteFile(tabId: number, url: string) {
  console.log("starting script");
  await chrome.scripting.insertCSS({
    target: { tabId },
    css: toastCss,
  });

  // activateEyeDropperChannel.sendP2C(tabId, { url });
}

export async function onColorPick(tabId: number, url: string) {
  if (url.startsWith("chrome://")) {
    // cannot access chrome url
    return;
  }
  await chrome.scripting.insertCSS({
    target: { tabId },
    css: toastCss,
  });

  type Args = {
    data: {
      url: string;
    };
  };

  const result = (await Scripting.executeFunction(tabId, async () => {
    const button = document.createElement("button");
    button.textContent = "Pick a color";
    document.body.appendChild(button);
    button.style.position = "fixed";
    button.style.top = "10px";
    button.style.left = "10px";
    button.style.zIndex = "1000";
    button.style.backgroundColor = "black";
    button.style.color = "white";
    button.style.padding = "10px";

    class EyedropperManager {
      private abortController = new AbortController();
      private cb!: (event: KeyboardEvent) => void;

      async getColor() {
        this.cb = (event: KeyboardEvent) => {
          if (event.key === "Escape") {
            this.abortController.abort();
          }
        };
        if (window.EyeDropper) {
          const eyeDropper = new window.EyeDropper();
          window.addEventListener("keydown", this.cb);
          try {
            const result = await eyeDropper.open({
              signal: this.abortController.signal,
            });
            window.removeEventListener("keydown", this.cb);
            return result.sRGBHex;
          } catch (e) {
            window.removeEventListener("keydown", this.cb);
            console.warn("eyedropper error", e);
            return null;
          }
        } else {
          return null;
        }
      }

      static hasAPI() {
        return Boolean(window.EyeDropper);
      }
    }

    const eyedropperManager = new EyedropperManager();

    return new Promise((resolve) => {
      button.addEventListener(
        "click",
        async () => {
          button.style.display = "none";
          const color = await eyedropperManager.getColor();
          if (color) {
            await navigator.clipboard.writeText(color);
            setTimeout(() => {
              button.remove();
            }, 50);
            resolve(color);
          }
        },
        {
          once: true,
        }
      );
    });
  })) as string | null;

  console.log("result", result);
  if (result) {
    await Handler.saveColorToStorage(result, url);
  }
}
