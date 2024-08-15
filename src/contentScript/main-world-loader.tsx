import scriptPath from "./main-world?script&module";

const script = document.createElement("script");
script.src = chrome.runtime.getURL(scriptPath);
script.type = "module";
document.head.appendChild(script);
