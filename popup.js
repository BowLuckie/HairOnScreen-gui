document.addEventListener("DOMContentLoaded", () => {
  main();
});

function main() {
  update_count(true);
  document.getElementById("increment").addEventListener("click", () => {
    chrome.runtime.sendMessage(
      {
        action: "popupCallIncrement",
      },
      () => {
        update_count();
      },
    );
  });

  document.getElementById("decrement").addEventListener("click", () => {
    chrome.runtime.sendMessage(
      {
        action: "popupCallDecrement",
      },
      () => {
        update_count();
      },
    );
  });

  document.getElementById("randomize").addEventListener("click", () => {
    chrome.runtime.sendMessage(
      {
        action: "popupCallRandomize",
      },
      () => {
        needs_reset();
      },
    );
  });

  document.getElementById("reset").addEventListener("click", () => {
    chrome.runtime.sendMessage(
      {
        action: "popupCallReset",
      },
      () => {
        update_count();
      },
    );
  });

  document.getElementById("exact").addEventListener("click", () => {
    const raw = parseInt(document.getElementById("exactIn").value, 10);
    const value = isNaN(raw) ? 0 : raw;
    if (value >= 0 && value <= 2048) {
      chrome.runtime.sendMessage(
        { action: "popupCallSetExact", value: value },
        () => {
          update_count();
        },
      );
    } else {
      show_status("hair amount must be between 0 and 2048!", true);
    }
  });
}

function update_count(offrip = false) {
  let counter = document.getElementById("counter");

  chrome.runtime.sendMessage({ action: "getNumImages" }, (response) => {
    counter.textContent = response.numImages;
  });

  if (!offrip) {
    needs_reset();
  }
}

function needs_reset() {
  show_status("Webpage must be reloaded for changes to become visible!");
}

function show_status(text, isWarn = false) {
  const el = document.getElementById("needsReset");
  el.textContent = text;
  el.classList.remove("hidden");
  el.classList.toggle("warn", isWarn);
}
