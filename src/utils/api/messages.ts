export class MessageModel {
  static async sendToProcess<K extends Channels>(
    channel: K,
    payload: Payloads[K]
  ) {
    return (await chrome.runtime.sendMessage({
      channel,
      payload,
    })) as Returns[K];
  }

  static async sendToContentScript<K extends Channels>(
    channel: K,
    payload: Payloads[K],
    options?: {
      tabId: number;
      current?: false;
    }
  ): Promise<Returns[K] | null>;

  static async sendToContentScript<K extends Channels>(
    channel: K,
    payload: Payloads[K],
    options?: {
      tabId?: number;
      current: true;
    }
  ): Promise<Returns[K] | null>;

  static async sendToContentScript<K extends Channels>(
    channel: K,
    payload: Payloads[K],
    options?: {
      tabId?: number;
      current?: boolean;
    }
  ) {
    if (options?.current) {
      const [tab] = await chrome.tabs.query({
        active: true,
        lastFocusedWindow: true,
      });
      return (await chrome.tabs.sendMessage(tab.id!, {
        channel,
        payload,
      })) as Returns[K] | null;
    }

    if (typeof options?.tabId === "number") {
      return (await chrome.tabs.sendMessage(options.tabId, {
        channel,
        payload,
      })) as Returns[K] | null;
    }
  }

  static addMessageListenerAsync<K extends Channels>(
    incomingPayload: ListenerPayloads<K>,
    func: ReceivingMessageFuncAsync<K>
  ) {
    chrome.runtime.onMessage.addListener(
      async (message: ListenerPayloads<K>, sender, sendResponse) => {
        if (message.channel === incomingPayload.channel) {
          const data = await func(message, sender, sendResponse);
          sendResponse(data);
          return true;
        }
      }
    );

    return func;
  }

  static addMessageListenerSync<K extends Channels>(
    incomingPayload: ListenerPayloads<K>,
    func: ReceivingMessageFuncSync<K>
  ) {
    chrome.runtime.onMessage.addListener(
      (message: ListenerPayloads<K>, sender, sendResponse) => {
        if (message.channel === incomingPayload.channel) {
          const data = func(message, sender, sendResponse);
          sendResponse(data);
        }
      }
    );

    return func;
  }

  static removeMessageListener(
    cb: (message: any, sender: any, sendResponse: any) => void | Promise<void>
  ) {
    chrome.runtime.onMessage.removeListener(cb);
  }
}

type Channels = "contentScript:upload";

type Payloads = {
  [K in Channels]: K extends "contentScript:upload" ? { url: string } : void;
};

type ListenerPayloads<K extends Channels> = Payloads[K] & { channel: K };

type Returns = {
  [K in Channels]: K extends "contentScript:upload"
    ? { message: string; filepath: string; framerate: number } & { channel: K }
    : void;
};

type ReceivingMessageFuncAsync<K extends Channels> = (
  message?: ListenerPayloads<K>,
  sender?: chrome.runtime.MessageSender,
  sendResponse?: (response?: any) => void
) => Promise<Returns[K]>;

type ReceivingMessageFuncSync<K extends Channels> = (
  message?: ListenerPayloads<K>,
  sender?: chrome.runtime.MessageSender,
  sendResponse?: (response?: any) => void
) => Returns[K];
