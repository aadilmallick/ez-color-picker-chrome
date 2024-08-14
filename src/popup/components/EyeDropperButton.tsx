import { ContentScriptModel } from "../../utils/api/scripting";
import mainWorldLoader from "../../contentScript/main/main-world-loader?script&module";

async function onColorPick(tab: chrome.tabs.Tab) {
  console.log(chrome.runtime.getURL("/eyedropper.iife.js"));
  console.log(tab);
  const eyedropperScript = new ContentScriptModel({
    id: "eyedropper",
    matches: [tab.url!],
    script: scriptPath,
  });
  eyedropperScript.upsertScript();
}
const EyeDropperButton = ({ tab }: { tab: chrome.tabs.Tab }) => {
  return (
    <button
      className="bg-black font-semibold text-white w-full text-center rounded-full shadow-md py-2 px-4"
      onClick={onColorPick.bind(null, tab)}
    >
      Open Color Picker
    </button>
  );
};

export default EyeDropperButton;
