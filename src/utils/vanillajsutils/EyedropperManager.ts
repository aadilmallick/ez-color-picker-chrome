export default class EyedropperManager {
  private abortController = new AbortController();
  private cb: (event: KeyboardEvent) => void;

  constructor() {
    this.cb = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        this.abortController.abort();
      }
    };
    window.addEventListener("keydown", this.cb);
  }

  async getColor() {
    if (window.EyeDropper) {
      const eyeDropper = new window.EyeDropper();
      try {
        const result = await eyeDropper.open({
          signal: this.abortController.signal,
        });
        return result.sRGBHex;
      } catch (e) {
        return null;
      }
    } else {
      return null;
    }
  }

  static hasAPI() {
    return Boolean(window.EyeDropper);
  }

  removeEscListener() {
    window.removeEventListener("keydown", this.cb);
  }
}
