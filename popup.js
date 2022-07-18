const idleImageInput = document.getElementById("idleImageUpload");
const clickedImageInput = document.getElementById("clickedImageUpload");
const imagesResetButton = document.getElementById("imagesResetButton");

idleImageInput.onchange = () => {
    chrome.storage.sync.set({'idleImage': idleImageInput.value});
};

clickedImageInput.onchange = () => {
    chrome.storage.sync.set({'clickedImage': clickedImageInput.value});
};

imagesResetButton.onclick = () => {
    chrome.storage.sync.remove(['idleImage','clickedImage']);
}