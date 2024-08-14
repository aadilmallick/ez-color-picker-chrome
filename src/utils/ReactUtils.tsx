import { createRoot } from "react-dom/client";
import React, { useEffect } from "react";

export function injectRoot(app: React.ReactNode) {
  const root = document.createElement("div");
  root.id = "crx-root";
  document.body.append(root);

  createRoot(root).render(<React.StrictMode>{app}</React.StrictMode>);
}

export function useObjectState<T extends Record<string, any>>(
  initialState: T
): [T, (newState: Partial<T>) => void] {
  const [state, setState] = React.useState(initialState);

  const setPartialState = React.useCallback((newState: Partial<T>) => {
    setState((prevState) => ({ ...prevState, ...newState }));
  }, []);

  return [state, setPartialState];
}

export function useGetActiveTab() {
  const [tab, setTab] = React.useState<chrome.tabs.Tab | null>(null);

  useEffect(() => {
    function onClicked(tab: chrome.tabs.Tab) {
      setTab(tab);
    }
    chrome.action.onClicked.addListener(onClicked);

    return () => {
      chrome.action.onClicked.removeListener(onClicked);
    };
  }, []);

  return { tab };
}

export function useGetCurrentTab() {
  const [tab, setTab] = React.useState<chrome.tabs.Tab | null>(null);

  useEffect(() => {
    async function getCurrentTab() {
      const [currentTab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      setTab(currentTab);
    }

    getCurrentTab();
  }, []);

  return { tab };
}
