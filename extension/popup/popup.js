// Localization keys for translations
const TR_KEYS = {
  extensionTitle: "extensionTitle",
  extensionSubtitle: "extensionSubtitle",
  extensionDesc: "extensionDesc",
  optionSaveCommentLabel: "optionSaveCommentLabel",
};

// Get translated messages
const TR_MESSAGES = {
  extensionTitle: chrome.i18n.getMessage(TR_KEYS.extensionTitle),
  extensionSubtitle: chrome.i18n.getMessage(TR_KEYS.extensionSubtitle),
  extensionDesc: chrome.i18n.getMessage(TR_KEYS.extensionDesc),
  optionSaveCommentLabel: chrome.i18n.getMessage(
    TR_KEYS.optionSaveCommentLabel
  ),
};

// Set the title and content based on translations
document.title = TR_MESSAGES.extensionTitle;
document.getElementById("popupTitle").textContent = TR_MESSAGES.extensionTitle;
document.getElementById("popupSubtitle").textContent =
  TR_MESSAGES.extensionSubtitle;
document.getElementById("extensionDesc").textContent =
  TR_MESSAGES.extensionDesc;
document.getElementById("saveCommentLabel").textContent =
  TR_MESSAGES.optionSaveCommentLabel;

// Get DOM elements
const checkboxEnableSaveComment = document.getElementById("enableSaveComment");
const sliderSaveComment = document.getElementById("sliderSaveComment");

// Load the value from synchronized storage during initialization
chrome.storage.sync.get("enableSaveComment", (data) => {
  if (chrome.runtime.lastError) {
    console.error("Error loading data:", chrome.runtime.lastError);
    return;
  }

  if (data.enableSaveComment !== undefined) {
    checkboxEnableSaveComment.checked = data.enableSaveComment;
  }
});

// Checkbox state handler function
function checkboxEventHandler() {
  const newState = checkboxEnableSaveComment.checked;

  // Save the new state to synchronized storage
  chrome.storage.sync.set({ enableSaveComment: newState }, () => {
    if (chrome.runtime.lastError) {
      console.error("Error saving data:", chrome.runtime.lastError);
    } else {
      // Get the current tab
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
          const currentTab = tabs[0];

          // Check if the URL matches the specified pattern
          if (
            (currentTab.url &&
              currentTab.url.startsWith("https://platzi.com/clases/")) ||
            currentTab.url.startsWith("https://platzi.com/comentario/")
          ) {
            // Reload the tab
            chrome.tabs.reload(currentTab.id);
          }
        }
      });
    }
  });
}

// Handle changes in the enableSaveComment checkbox
checkboxEnableSaveComment.addEventListener("change", checkboxEventHandler);

// Handle click events on the slider
sliderSaveComment.addEventListener("click", () => {
  checkboxEnableSaveComment.checked = !checkboxEnableSaveComment.checked;
  checkboxEventHandler();
});
