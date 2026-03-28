let observer = null;

function setTitle(title) {
  document.title = title;

  // Disconnect any existing observer before creating a new one
  if (observer) {
    observer.disconnect();
  }

  // Observe and override any attempts by the page to change the title back
  observer = new MutationObserver(() => {
    if (document.title !== title) {
      document.title = title;
    }
  });

  const titleEl = document.querySelector("title");
  if (titleEl) {
    observer.observe(titleEl, { childList: true, characterData: true, subtree: true });
  }
}

function resetTitle() {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
  // Trigger a re-evaluation of the original title by the page
  const titleEl = document.querySelector("title");
  if (titleEl) {
    const original = titleEl.textContent;
    titleEl.textContent = "";
    titleEl.textContent = original;
  }
}

function showInlinePrompt() {
  // Remove existing prompt if any
  const existing = document.getElementById("rename-tab-prompt");
  if (existing) existing.remove();

  const overlay = document.createElement("div");
  overlay.id = "rename-tab-prompt";
  overlay.style.cssText =
    "position:fixed;top:0;left:0;width:100%;height:100%;z-index:2147483647;" +
    "display:flex;align-items:flex-start;justify-content:center;background:rgba(0,0,0,0.3);";

  const box = document.createElement("div");
  box.style.cssText =
    "margin-top:80px;background:#fff;padding:16px;border-radius:8px;" +
    "box-shadow:0 4px 24px rgba(0,0,0,0.25);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;" +
    "display:flex;gap:8px;align-items:center;";

  const input = document.createElement("input");
  input.type = "text";
  input.value = document.title;
  input.style.cssText =
    "width:300px;padding:6px 10px;font-size:14px;border:1px solid #ccc;border-radius:4px;outline:none;";

  const btn = document.createElement("button");
  btn.textContent = "Rename";
  btn.style.cssText =
    "padding:6px 14px;font-size:13px;border:none;border-radius:4px;background:#0060df;color:#fff;cursor:pointer;";

  function commit() {
    const newTitle = input.value.trim();
    if (newTitle) setTitle(newTitle);
    overlay.remove();
  }

  function cancel() {
    overlay.remove();
  }

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") commit();
    if (e.key === "Escape") cancel();
  });
  btn.addEventListener("click", commit);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) cancel();
  });

  box.appendChild(input);
  box.appendChild(btn);
  overlay.appendChild(box);
  document.documentElement.appendChild(overlay);
  input.select();
}

browser.runtime.onMessage.addListener((message) => {
  if (message.action === "rename") {
    setTitle(message.title);
  } else if (message.action === "reset") {
    resetTitle();
  } else if (message.action === "prompt-rename") {
    showInlinePrompt();
  }
});
