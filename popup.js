async function getCurrentTab() {
  const tabs = await browser.tabs.query({ active: true, currentWindow: true });
  return tabs[0];
}

async function init() {
  const tab = await getCurrentTab();
  const titleInput = document.getElementById("title");

  // Pre-fill with current tab title
  titleInput.value = tab.title;
  titleInput.select();

  document.getElementById("rename").addEventListener("click", () => {
    const newTitle = titleInput.value.trim();
    if (newTitle) {
      browser.tabs.sendMessage(tab.id, { action: "rename", title: newTitle });
      window.close();
    }
  });

  document.getElementById("reset").addEventListener("click", () => {
    browser.tabs.sendMessage(tab.id, { action: "reset" });
    window.close();
  });

  titleInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      document.getElementById("rename").click();
    }
  });
}

init();
