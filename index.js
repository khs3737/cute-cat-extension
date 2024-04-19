let isCatShow;

const init = () => {
    chrome.storage.local.get({ isCatShow : true }, ({ isCatShow }) => {
        this.isCatShow = isCatShow;
        makeCat({imageNum: 1, size: 128, left: window.innerWidth - 250, zIndex: 1000000000});
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
            zIndex: 1100000000
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
        const offsetX = event.clientX - cat.getBoundingClientRect().left;
        const offsetY = event.clientY - cat.getBoundingClientRect().top;
        
        const mouseMoveEvent = (event) => {
            cat.style.left = event.clientX - offsetX + 'px';
            cat.style.top = event.clientY - offsetY + 'px';
        };

        const mouseUpEvent = () => {
            cat.style.top = null;
            document.removeEventListener("mousemove", mouseMoveEvent);
            document.removeEventListener("mouseup", mouseUpEvent);
        }

        document.addEventListener("mousemove", mouseMoveEvent);
        document.addEventListener("mouseup", mouseUpEvent);
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
    fish.ondragstart = () => false;

    fish.onmousedown = (event) => {
        const offsetX = event.clientX - fish.getBoundingClientRect().left;
        const offsetY = event.clientY - fish.getBoundingClientRect().top;
        
        const mouseMoveEvent = (event) => {
            fish.style.left = event.clientX - offsetX + 'px';
            fish.style.top = event.clientY - offsetY + 'px';
        };
    
        const mouseUpEvent = (event) => {
            fish.hidden = true;
            let target = document.elementFromPoint(event.clientX, event.clientY);
            fish.hidden = false;

            if(target.alt === 'cat'){
                target.style.width = target.getBoundingClientRect().width * 1.2 + 'px';
                target.style.height = target.getBoundingClientRect().height * 1.2 + 'px';
                target.click();
                document.removeEventListener("mousemove", mouseMoveEvent);
                document.removeEventListener("mouseup", mouseUpEvent);
                fish.remove();
            }

            fish.style.top = null;
            document.removeEventListener("mousemove", mouseMoveEvent);
            document.removeEventListener("mouseup", mouseUpEvent);
        }

        document.addEventListener("mousemove", mouseMoveEvent);
        document.addEventListener("mouseup", mouseUpEvent);
    };

    document.body.appendChild(fish);
}

init();
