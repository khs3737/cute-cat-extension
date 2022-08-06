const toggleCatsSwitch = document.getElementById("toggleCatsSwitch");
const fishButton = document.getElementById("FishButton");

const restoreOptions = () => {
    chrome.storage.local.get({ isCatShow : true }, ({ isCatShow }) => toggleCatsSwitch.checked = isCatShow);
};

document.addEventListener('DOMContentLoaded', restoreOptions);

toggleCatsSwitch.onchange = () => {
    chrome.storage.local.set({isCatShow: toggleCatsSwitch.checked });
}

fishButton.onclick = () => {
    chrome.storage.local.set({getFish: true});
    chrome.storage.local.set({getFish: false});
}