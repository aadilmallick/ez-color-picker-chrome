import { openEyedropperChannel } from "../../background/messageHandlers";

async function onColorPick(tab: chrome.tabs.Tab) {
  console.log(tab, "sending message");

  // 1. send message to background script to start scripting. Pass along tab id and url
  openEyedropperChannel.sendP2P({ tabId: tab.id!, url: tab.url! });
  // 2. close window
  window.close();
}

const EyeDropperButton = ({ tab }: { tab: chrome.tabs.Tab }) => {
  return (
    <button
      onClick={() => onColorPick(tab)}
      className="bg-black font-semibold text-white w-full text-center rounded-full shadow-md py-2 px-4"
    >
      Open Color Picker
    </button>
  );
};

export default EyeDropperButton;
