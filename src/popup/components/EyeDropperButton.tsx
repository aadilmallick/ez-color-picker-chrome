import { openEyedropperChannel } from "../../background/handlers";

async function onColorPick(tab: chrome.tabs.Tab) {
  openEyedropperChannel.sendP2C(tab.id!, {
    url: tab.url!,
  });
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
