document.getElementById("increment").addEventListener("click", () => {
  chrome.runtime.sendMessage({
    action: "popupCallIncrement"
  })
});
