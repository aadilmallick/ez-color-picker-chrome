import { MessagesOneWay } from "../utils/api/messages";

export const openEyedropperChannel = new MessagesOneWay<{
  tabId: number;
  url: string;
}>("open-eyedropper");

export const activateEyeDropperChannel = new MessagesOneWay<{
  url: string;
}>("activate-eyedropper");

export const storeColorChannel = new MessagesOneWay<{
  url: string;
  color: string;
}>("store-color");
