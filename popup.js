const toggleCatsSwitch = document.getElementById("toggleCatsSwitch");

const restoreOptions = () => {
    chrome.storage.local.get({ isCatShow : true }, ({ isCatShow }) => toggleCatsSwitch.checked = isCatShow);
};

document.addEventListener('DOMContentLoaded', restoreOptions);

toggleCatsSwitch.onchange = () => {
    chrome.storage.local.set({isCatShow: toggleCatsSwitch.checked },() => console.log({isCatShow: toggleCatsSwitch.checked}));
}