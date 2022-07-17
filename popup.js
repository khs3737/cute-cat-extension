const imageInput = document.getElementById("imageUpload");

imageInput.onchange = () => {
    chrome.storage.sync.set({'image': imageInput.value});
};

document.getElementById('imageSaveButton').onclick = saveImage;