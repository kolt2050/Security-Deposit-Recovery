chrome.runtime.onInstalled.addListener(() => {
  chrome.notifications.create(
    {
      type: "basic",
      iconUrl: chrome.runtime.getURL("icons/icon-128.png"),
      title: "Security Deposit Recovery installed",
      message: "Open the extension to start or continue a case review."
    },
    () => {
      void chrome.runtime.lastError;
    }
  );
});
