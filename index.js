let isCatShow;

const init = () => {
    chrome.storage.local.get({ isCatShow : true }, ({ isCatShow }) => {
        this.isCatShow = isCatShow;
        makeCat({imageNum: 1, size: 128, left: window.innerWidth - 250, zIndex: 10000});
    });
};

let toggleCatEvent = new Event('toggleCatEvent');

chrome.storage.onChanged.addListener((changes) => {
    for (let [key, { newValue }] of Object.entries(changes)) {
      if(key === 'isCatShow'){
        isCatShow = newValue;
        document.dispatchEvent(toggleCatEvent);
      }
      if(key === 'getFish' && newValue === true){
        const size = Math.floor(Math.random() * 48 ) + 32;

        makeFish({
            size,
            left: Math.floor(Math.random() * window.innerWidth - size * 2) + size,
            zIndex: 11000
        });
      }
    }
  });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const makeCat = ({imageNum, size, left, zIndex}) => {

    const idleImageUrl = chrome.runtime.getURL(`/images/cat_idle_${imageNum}.png`);

    const clickedImageUrl = chrome.runtime.getURL(`/images/cat_clicked_${imageNum}.png`);

    let cat = document.createElement('img');
    
    cat.style.position = 'fixed';
    cat.style.bottom = '0px';
    cat.style.width = `${size}px`;
    cat.style.height = `${size}px`;
    cat.style.left = `${left}px`;
    cat.style.zIndex = `${zIndex}`;
    cat.style.imageRendering = 'pixelated';
    cat.style.backfaceVisibility = 'hidden';

    cat.src = idleImageUrl;
    cat.alt = 'cat';

    cat.hidden = !this.isCatShow; 

    document.addEventListener('toggleCatEvent', () => { cat.hidden = !isCatShow });

    // Click event

    let isClicked = false;

    cat.onclick = async () => {
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
        curSize = cat.getBoundingClientRect().width;
        makeCat({
            imageNum: Math.floor(Math.random() * 3) + 1,
            size: Math.max( Math.floor(Math.random() * curSize / 2 + curSize / 3), 16),
            left: Math.floor(Math.random() * window.innerWidth - curSize * 2) + curSize,
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

const makeFish = ({size, left, zIndex}) => {
    const imageUrl = chrome.runtime.getURL(`/images/fish_1.png`);

    let fish = document.createElement('img');

    fish.style.position = 'fixed';
    fish.style.bottom = '0px';
    fish.style.width = `${size}px`;
    fish.style.height = `${size}px`;
    fish.style.left = `${left}px`;
    fish.style.zIndex = `${zIndex}`;
    fish.style.transform = `scaleX(${Math.random() > 0.5 ? 1 : -1}) rotate(${Math.floor( Math.random() * 30 - 15 )}deg)`;

    fish.src = imageUrl;
    fish.alt = 'fish';

    fish.hidden = !this.isCatShow;

    document.addEventListener('toggleCatEvent', () => {fish.hidden = !isCatShow });

    // Drag event

    fish.draggable = true;
    fish.ondragstart = (e) => e.preventDefault();

    fish.onmousedown = (event) => {
        let shiftX = event.clientX - fish.getBoundingClientRect().left;
        let shiftY = event.clientY - fish.getBoundingClientRect().bottom;
        
        fish.style.position = 'absolute';
        fish.style.left = event.pageX - shiftX + 'px';
        fish.style.bottom = window.innerHeight - event.pageY + shiftY + 'px';

        document.onmousemove = (event) => {
            fish.style.position = 'absolute';
            fish.style.left = event.pageX - shiftX + 'px';
            fish.style.bottom = window.innerHeight - event.pageY + shiftY + 'px';
        };
    
        document.onmouseup = (event) => {
            fish.hidden = true;
            let target = document.elementFromPoint(event.clientX, event.clientY);
            fish.hidden = false;

            if(target.alt === 'cat'){
                target.style.width = target.getBoundingClientRect().width * 1.2 + 'px';
                target.style.height = target.getBoundingClientRect().height * 1.2 + 'px';
                target.click();
                fish.remove();
            }

            document.onmousemove = null;
            document.onmouseup = null;
            fish.style.position = 'fixed';
            fish.style.bottom = '0px';
            fish.style.left = Math.min( Math.max(0, event.pageX - shiftX), window.innerWidth - size ) + 'px';
        }
    };

    document.body.appendChild(fish);
}

init();
