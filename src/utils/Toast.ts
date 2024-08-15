type ToastType = "info" | "success" | "danger" | "default" | "warning";
type ToastManagerOptions = {
  timeout?: number;
};
export class ToastManager {
  private toastContainer?: HTMLElement;
  constructor(private options: ToastManagerOptions = { timeout: 3000 }) {}

  setup() {
    const element = document.getElementById("toasts");
    if (element) return;
    const toastContainer = document.createElement("div");
    toastContainer.id = "toasts";

    // add toast container to body
    document.body.appendChild(toastContainer);

    // set toast container
    this.toastContainer = toastContainer;
  }

  toast(message: string, type: ToastType = "default") {
    const toast = new Toast(message, type, this.options.timeout);
    if (!this.toastContainer) throw new Error("Toast container not set");
    this.toastContainer.appendChild(toast.element);
    setTimeout(() => {
      // run exit animation
      const animation = toast.element.animate(
        [{ opacity: 0, transform: "translateX(250px)" }],
        {
          duration: 250,
        }
      );
      // wait for animation to finish
      animation.onfinish = () => {
        toast.element.remove();
      };
    }, this.options.timeout);
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
  constructor(message: string, type: ToastType = "default", duration = 3000) {
    const toast = document.createElement("div");
    toast.classList.add("toast");
    toast.classList.add(`toast-${type}`);
    toast.style.setProperty("--toast-duration", `${duration}ms`);
    toast.innerText = message;

    this.element = toast;
  }
}
