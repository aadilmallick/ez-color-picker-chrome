import Scripting from "../utils/api/scripting";
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

  const result = (await Scripting.executeFunction(
    tabId,
    async (args: Args) => {
      const button = document.createElement("button");
      button.textContent = "Pick a color";
      document.body.appendChild(button);
      button.style.position = "fixed";
      button.style.top = "10px";
      button.style.left = "10px";
      button.style.zIndex = "100000";
      type ToastType = "info" | "success" | "danger" | "default" | "warning";
      type ToastManagerOptions = {
        timeout?: number;
        position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
      };
      class ToastManager {
        private toastContainer?: HTMLElement;
        private options: ToastManagerOptions;

        public get containerElement() {
          return this.toastContainer;
        }

        constructor(options: ToastManagerOptions = {}) {
          this.options = {
            timeout: 3000,
            position: "bottom-right",
            ...options,
          };
        }

        setup() {
          const element = document.getElementById("toasts");
          if (element) return;
          const toastContainer = document.createElement("div");
          toastContainer.id = "toasts";
          toastContainer.classList.add(this.options.position!);

          // add toast container to body
          document.body.appendChild(toastContainer);

          // set toast container
          this.toastContainer = toastContainer;
        }

        toast(message: string, type: ToastType = "default") {
          const toast = new Toast({
            message,
            type,
            duration: this.options.timeout,
          });
          if (!this.toastContainer) throw new Error("Toast container not set");
          this.toastContainer.appendChild(toast.element);
          toast.show();
        }

        success(message: string) {
          this.toast(message, "success");
        }

        info(message: string) {
          this.toast(message, "info");
        }

        danger(message: string) {
          this.toast(message, "danger");
        }

        warning(message: string) {
          this.toast(message, "warning");
        }
      }

      class Toast {
        public element: HTMLElement;
        private timeoutId: number | null = null;
        private duration: number;
        constructor({
          message,
          duration = 3000,
          type = "default",
          onClick,
        }: {
          message: string;
          type?: ToastType;
          duration?: number;
          onClick?: () => void;
        }) {
          const toast = document.createElement("div");
          toast.classList.add("toast");
          toast.classList.add(`toast-${type}`);
          toast.style.setProperty("--toast-duration", `${duration}ms`);
          toast.innerText = message;

          this.element = toast;
          this.duration = duration;

          this.element.addEventListener(
            "click",
            (e) => {
              e.stopPropagation();
              onClick?.();
              this.dismiss();
            },
            {
              once: true,
            }
          );
        }

        animateOut() {
          const animation = this.element.animate(
            [{ opacity: 0, transform: "translateX(250px)" }],
            {
              duration: 250,
            }
          );
          // wait for animation to finish
          animation.onfinish = () => {
            this.element.remove();
          };
        }

        show() {
          this.timeoutId = setTimeout(() => {
            this.animateOut();
            this.timeoutId = null;
          }, this.duration);
        }

        dismiss() {
          if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
            this.animateOut();
          }
        }
      }

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
      const toastManager = new ToastManager();
      toastManager.setup();
      return new Promise((resolve) => {
        button.addEventListener(
          "click",
          async () => {
            button.style.display = "none";
            const color = await eyedropperManager.getColor();
            if (color) {
              toastManager.success("Color copied!");
              await navigator.clipboard.writeText(color);
            }
            resolve(color);
          },
          { once: true }
        );
      });
    },
    { data: { url } }
  )) as string | null;

  if (result) {
    await Handler.saveColorToStorage(result, url);
  }
}
