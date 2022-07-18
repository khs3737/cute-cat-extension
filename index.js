const defaultIdleImageUrl = chrome.runtime.getURL('/images/cat_idle_1.png');
const defaultClickedImageUrl = chrome.runtime.getURL('/images/cat_clicked_1.png')

const showClickedImage = () => {
    chrome.storage.sync.get('clickedImage', (result) => {
        console.log({result});
        cat.setAttribute('src',result['clickedImage'] ?? defaultClickedImageUrl);
    });}

var cat = document.createElement('img');
cat.style.position = 'fixed';
cat.style.bottom = '0px';
cat.style.right = '100px';
cat.setAttribute('alt','cat');
cat.onclick = showClickedImage;
cat.ondrag

chrome.storage.sync.get('idleImage', (result) => {
    console.log({result});
    cat.setAttribute('src',result['idleImage'] ?? defaultIdleImageUrl);
});

document.body.appendChild(cat);