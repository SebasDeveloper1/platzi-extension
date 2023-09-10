// locales
const TR_KEYS = {
  extensionTitle: "extensionTitle",
};
const TR_TITLE = chrome.i18n.getMessage(TR_KEYS.extensionTitle);

// elements
document.title = TR_TITLE;
document.getElementById("extensionTitle").textContent = TR_TITLE;
