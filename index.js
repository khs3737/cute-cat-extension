let randCatImage = Math.floor(Math.random() * 100);

let defaultIdleImageUrl = null;
let defaultClickedImageUrl = null;

if(randCatImage <80){
    defaultIdleImageUrl = chrome.runtime.getURL('/images/cat_idle_1.png');
    defaultClickedImageUrl = chrome.runtime.getURL('/images/cat_clicked_1.png');
} else if(randCatImage <90){
    defaultIdleImageUrl = chrome.runtime.getURL('/images/cat_idle_2.png');
    defaultClickedImageUrl = chrome.runtime.getURL('/images/cat_clicked_2.png');
}else{
    defaultIdleImageUrl = chrome.runtime.getURL('/images/cat_idle_3.png');
    defaultClickedImageUrl = chrome.runtime.getURL('/images/cat_clicked_3.png');
}


const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const makeCat = ({imageNum, size, left, zIndex}) =>{

    const idleImageUrl = chrome.runtime.getURL(`/images/cat_idle_${imageNum}.png`);

    const clickedImageUrl = chrome.runtime.getURL(`/images/cat_clicked_${imageNum}.png`);

    let cat = document.createElement('img');

    cat.style.position = 'fixed';
    cat.style.bottom = '0px';
    cat.style.width = `${size}px`;
    cat.style.height = `${size}px`;
    cat.style.left = `${left}px`;
    cat.style.zIndex = `${zIndex}`;
    cat.src = idleImageUrl;
    cat.alt = 'cat';

    // Click event

    let isClicked = false;

    cat.onclick = async (image) => {
        if(!isClicked){
            cat.src = clickedImageUrl;
            isClicked = true;
            sleep(1500).then(() => {
                cat.src = idleImageUrl;
                isClicked = false;
            });
        }
    };

    // Double Click event

    cat.ondblclick = async () => {
        makeCat({
            imageNum: Math.floor(Math.random() * 3) + 1,
            size: Math.max( Math.floor(Math.random() * size / 2 + size / 3), 16),
            left: Math.floor(Math.random() * window.innerWidth - size * 2) + size,
            zIndex: zIndex + 1
        });
    }

    // Drag event

    cat.draggable = true;
    cat.ondragstart = () => false;

    cat.onmousedown = (event) => {
        let shiftX = event.clientX - cat.getBoundingClientRect().left;
        let shiftY = event.clientY - cat.getBoundingClientRect().bottom;
        
        cat.style.position = 'absolute';
        cat.style.left = event.pageX - shiftX + 'px';
        cat.style.bottom = window.innerHeight - event.pageY + shiftY + 'px';

        document.onmousemove = (event) => {
            cat.style.position = 'absolute';
            cat.style.left = event.pageX - shiftX + 'px';
            cat.style.bottom = window.innerHeight - event.pageY + shiftY + 'px';
        };
    
        document.onmouseup = (event) => {
            document.onmousemove = null;
            document.onmouseup = null;
            cat.style.position = 'fixed';
            cat.style.bottom = '0px';
            cat.style.left = Math.min( Math.max(0, event.pageX - shiftX), window.innerWidth - size ) + 'px';
        }
    };

    document.body.appendChild(cat);
};

makeCat({imageNum: 1, size: 128, left: window.innerWidth - 250, zIndex: 10000});