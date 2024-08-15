import { LocalStorage } from "../utils/api/storage";

export const storage = new LocalStorage({
  savedColors: [] as { url: string; color: string }[],
});

export class Handler {
  static async saveColorToStorage(color: string, url: string) {
    const savedColors = await storage.get("savedColors");
    if (savedColors.filter((c) => c.color === color).length > 0) {
      return;
    }
    await storage.set("savedColors", [...savedColors, { color, url }]);
  }

  static async deleteColor(color: string) {
    const savedColors = await storage.get("savedColors");
    const newColors = savedColors.filter((c) => c.color !== color);
    await storage.set("savedColors", newColors);
  }
}
