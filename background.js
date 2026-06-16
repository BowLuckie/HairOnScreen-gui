chrome.storage.sync.get("numHairImages", function (items) {
  var hairCount = items.hasOwnProperty("numHairImages")
    ? items.numHairImages
    : 1;

  chrome.storage.local.get("guiEnabled", (data) => {
    const enabled = data.guiEnabled ?? false;
    updatePopup(enabled);

    chrome.contextMenus.removeAll();
    chrome.contextMenus.create({
      title: hairCountText(hairCount),
      id: "hair_count",
      contexts: ["action"],
      enabled: false,
    });
    chrome.contextMenus.create({
      title: "More hair!",
      id: "more_hair",
      contexts: ["action"],
    });
    chrome.contextMenus.create({
      title: "Less hair!",
      id: "less_hair",
      contexts: ["action"],
    });
    chrome.contextMenus.create({
      title: "Reset hair!",
      id: "reset_hair",
      contexts: ["action"],
    });
    chrome.contextMenus.create({
      title: "Randomize hair!",
      id: "randomize_hair",
      contexts: ["action"],
    });
    chrome.contextMenus.create({
      title: "Allow GUI menu",
      id: "toggleGui",
      type: "checkbox",
      checked: enabled,
      contexts: ["action"],
    });
    chrome.contextMenus.create({
      title: "(reload after updating)",
      id: "reload_prompt",
      contexts: ["action"],
      enabled: false,
    });
  });
});

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId == "more_hair") incrementNumImages();
  else if (info.menuItemId == "less_hair") decrementNumImages();
  else if (info.menuItemId == "randomize_hair") randomizeHair();
  else if (info.menuItemId == "reset_hair") resetNumImages();
  else if (info.menuItemId == "toggleGui") toggleGui(info.checked); 
});

function hairCountText(num) {
  return "Hair count: " + num;
}

function updateNumImages(updateFunction) {
  chrome.storage.sync.get("numHairImages", function (items) {
    var numHairImages = items.hasOwnProperty("numHairImages")
      ? updateFunction(items.numHairImages)
      : updateFunction(1);
    chrome.storage.sync.set({ numHairImages: numHairImages });
    chrome.contextMenus.update("hair_count", {
      title: hairCountText(numHairImages),
    });
  });
}

function incrementNumImages() {
  updateNumImages((num) => Math.min(2048, num + 1));
}
function decrementNumImages() {
  updateNumImages((num) => Math.max(0, num - 1));
}
function resetNumImages() {
  updateNumImages(() => 1);
}
function randomizeHair() {
  chrome.storage.sync.set({ hairImages: [] });
}

function updatePopup(enabled) {
  chrome.action.setPopup({ popup: enabled ? "popup.html" : "" });
}

function toggleGui(checked) {
  chrome.storage.local.set({ guiEnabled: checked });
  updatePopup(checked);
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  let action = message.action;
  if (action == "getNumImages") {
    chrome.storage.sync.get("numHairImages", (items) => {
      sendResponse({ numImages: items.numHairImages ?? 1 });
    });
    return true;
  }
  if (action == "popupCallIncrement") {
    incrementNumImages();
    sendResponse({});
  } else if (action == "popupCallDecrement") {
    decrementNumImages();
    sendResponse({});
  } else if (action == "popupCallReset") {
    resetNumImages();
    sendResponse({});
  } else if (action == "popupCallRandomize") {
    randomizeHair();
    sendResponse({});
  } else if (action == "popupCallSetExact") {
    updateNumImages(() => message.value);
    sendResponse({});
  }
});
