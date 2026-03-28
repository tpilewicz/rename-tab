browser.commands.onCommand.addListener(async (command) => {
  if (command === "rename-tab") {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    if (tabs[0]) {
      browser.tabs.sendMessage(tabs[0].id, { action: "prompt-rename" });
    }
  }
});
