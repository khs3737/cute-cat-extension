const idleImageUrl = chrome.runtime.getURL('/images/cat_idle_1.png');
const clickedImageUrl = chrome.runtime.getURL('/images/cat_clicked_1.png')

function changeImage(){
    image.setAttribute('src',clickedImageUrl);
}

var image = document.createElement('img');
image.style.position = 'fixed';
image.style.bottom = '0px';
image.style.right = '100px';
image.setAttribute('alt','image');
image.onclick = changeImage;

chrome.storage.sync.get('image', (result) => {
    console.log({resultValue: result});
    if(result['image'] !== undefined){
        image.setAttribute('src',result['image'])
    }else{
        image.setAttribute('src',idleImageUrl);
    }
  });

document.body.appendChild(image);