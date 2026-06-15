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

  document.getElementById("countRequest").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "getNumImages" }, (response) => {
      console.log(response.numImages);
    });
  });

  document.getElementById("exact").addEventListener("click", () => {
    const value = parseInt(document.getElementById("exactIn").value, 10);
    if (value >= 0 && value <= 2048) {
      chrome.runtime.sendMessage(
        { action: "popupCallSetExact", value: value },
        () => {
          update_count();
        },
      );
    } else {
      console.log("out of bounds");

      let warning_text = document.getElementById("needsReset");
      warning_text.textContent = "hair amount must be between 0 and 2048!";
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
  let warning_text = document.getElementById("needsReset");

  warning_text.textContent = "Webpage must be reloaded for hair to be visible!";
}
