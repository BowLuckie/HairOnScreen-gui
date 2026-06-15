// generate the context menus brought up by clicking the browser action
chrome.storage.sync.get("numHairImages", function (items) {
  var hairCount = items.hasOwnProperty("numHairImages")
    ? items.numHairImages
    : 1;

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
    title: "(reload after updating)",
    id: "reload_prompt",
    contexts: ["action"],
    enabled: false,
  });
});

// handle context menu clicks
chrome.contextMenus.onClicked.addListener(function (info) {
  if (info.menuItemId == "more_hair") incrementNumImages();
  else if (info.menuItemId == "less_hair") decrementNumImages();
  else if (info.menuItemId == "randomize_hair") randomizeHair();
  else if (info.menuItemId == "reset_hair") resetNumImages();
});

// displays count
function hairCountText(num) {
  return "Hair count: " + num;
}

// general function for updating the hair count
function updateNumImages(updateFunction) {
  chrome.storage.sync.get("numHairImages", function (items) {
    var numHairImages;
    if (items.hasOwnProperty("numHairImages")) {
      numHairImages = updateFunction(items.numHairImages);
    } else {
      numHairImages = updateFunction(1);
    }

    chrome.storage.sync.set({ numHairImages: numHairImages });

    chrome.contextMenus.update("hair_count", {
      title: hairCountText(numHairImages),
    });
  });
}

// increment count
function incrementNumImages() {
  updateNumImages(function (num) {
    return num + 1;
  });
}

// decrement count
function decrementNumImages() {
  updateNumImages(function (num) {
    return Math.max(0, num - 1);
  });
}

// reset count to 1
function resetNumImages() {
  updateNumImages(function () {
    return 1;
  });
}

// randomize positions
function randomizeHair() {
  chrome.storage.sync.set({ hairImages: [] });
}

// connect popup and background
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
