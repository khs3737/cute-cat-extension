const defaultIdleImageUrl = chrome.runtime.getURL('/images/cat_idle_1.png');
const defaultClickedImageUrl = chrome.runtime.getURL('/images/cat_clicked_1.png')

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let isClicked = false;

const onClickCat = async () => {
    if(!isClicked){
        cat.src = defaultClickedImageUrl;
        isClicked = true;
        sleep(1500).then(() => {
            cat.src = defaultIdleImageUrl;
            isClicked = false;
        });
    }  
};

const onDragCat = (event) => {
    let shiftX = event.clientX - cat.getBoundingClientRect().right;
    let shiftY = event.clientY - cat.getBoundingClientRect().bottom;
    cat.style.position = 'absolute';
    cat.style.right = window.innerWidth - event.pageX + shiftX + 'px';
    cat.style.bottom = window.innerHeight - event.pageY + shiftY + 'px';
    const onMouseMove = (event) => {
        cat.style.position = 'absolute';
        cat.style.right = window.innerWidth - event.pageX + shiftX + 'px';
        cat.style.bottom = window.innerHeight - event.pageY + shiftY + 'px';
    };

    document.addEventListener('mousemove', onMouseMove);

    cat.onmouseup = (event) => {
        document.removeEventListener('mousemove', onMouseMove);
        cat.style.position = 'fixed';
        cat.style.bottom = '0px';
        cat.style.right = window.innerWidth - event.pageX;
    }
};

let cat = document.createElement('img');

cat.style.position = 'fixed';
cat.style.bottom = '0px';
cat.style.right = '100px';
cat.style.zIndex = '10000';
cat.src = defaultIdleImageUrl;
cat.alt = 'cat';

cat.onclick = onClickCat;

cat.draggable = true;
cat.onmousedown = onDragCat;
cat.ondragstart = () => false;

document.body.appendChild(cat);