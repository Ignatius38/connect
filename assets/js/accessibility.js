document.addEventListener("DOMContentLoaded", () => {
  // 1. Prepare <main> so the skip link can jump directly to it
  const mainEl = document.querySelector("main");
  if (mainEl) {
    if (!mainEl.id) mainEl.id = "main-content";
    mainEl.setAttribute("tabindex", "-1");
  }

  // 2. Create the Skip to Main Content link
  const skipLink = document.createElement("a");
  skipLink.href = "#main-content";
  skipLink.className = "skip-link";
  skipLink.textContent = "Skip to main content";
  document.body.prepend(skipLink);

  // 3. Create Screen Reader Live Announcer
  const announcer = document.createElement("div");
  announcer.setAttribute("aria-live", "polite");
  announcer.style.position = "absolute";
  announcer.style.left = "-9999px";
  document.body.appendChild(announcer);

  // 4. Add the Toggle Button to the Navbar
  const navLinks = document.querySelector(".nav-links");
  if (!navLinks) return;

  const toggleBtn = document.createElement("button");
  toggleBtn.type = "button";
  toggleBtn.className = "a11y-toggle";
  toggleBtn.setAttribute("aria-label", "Toggle Keyboard Focus Assist");
  navLinks.prepend(toggleBtn);

  function setFocusMode(isEnabled) {
    document.body.classList.toggle("focus-assist", isEnabled);
    toggleBtn.setAttribute("aria-pressed", String(isEnabled));
    toggleBtn.textContent = isEnabled ? "Focus Mode: On" : "Focus Mode: Off";
    skipLink.style.display = isEnabled ? "inline-block" : "none";
    localStorage.setItem("connect_focus_assist", String(isEnabled));
  }

  // Restore saved state on page load (defaults to false/Off)
  const savedState = localStorage.getItem("connect_focus_assist") === "true";
  setFocusMode(savedState);

  // Toggle on click
  toggleBtn.addEventListener("click", () => {
    const nextState = !document.body.classList.contains("focus-assist");
    setFocusMode(nextState);
    announcer.textContent = nextState
      ? "Keyboard focus mode enabled. Press Tab to navigate with high-visibility outlines."
      : "Keyboard focus mode disabled.";
  });
});