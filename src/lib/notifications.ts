export async function showNotification(title: string, message: string): Promise<void> {
  if (typeof chrome === "undefined" || !chrome.notifications) {
    return;
  }

  try {
    await chrome.notifications.create({
      type: "basic",
      iconUrl: chrome.runtime.getURL("icons/icon-128.png"),
      title,
      message
    });
  } catch {
    // Notifications are optional. Permission denial should never break document generation.
  }
}

export async function scheduleFollowUpReminder(): Promise<void> {
  await showNotification("Reminder set", "Follow up with your landlord regarding your deposit claim.");
}
