// main-world-loader.ts
// @ts-ignore
import mainWorldScript from "./mainWorld?script&module"; // By appending ?module to the import, you're explicitly specifying that you want to import the script as a module script.

const script = document.createElement("script");
script.src = chrome.runtime.getURL(mainWorldScript);
script.type = "module"; // important if you are using imports in your module.
document.head.prepend(script);
