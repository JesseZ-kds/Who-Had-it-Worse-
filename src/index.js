const leftApp = new PIXI.Application();
const rightApp = new PIXI.Application();

const left = document.getElementById('left');
const right = document.getElementById('right');

left.appendChild(leftApp.view);
right.appendChild(rightApp.view);

let leftGraphics = new PIXI.Graphics();
let rightGraphics = new PIXI.Graphics();

leftApp.stage.addChild(leftGraphics);
rightApp.stage.addChild(rightGraphics);

let frames = {
    "Demeter's Revenge": {
        "value": 1,
        "text": "Demeter and Limos, 2 opposing goddesses teamed up the King of Thessalian, Erysichthon, who cut down all the wood in Demeter's sacred grove, to use for his personal gain. Overnight, Limos cursed him to always feel hungry. The King ate everything in the town, but that was not enough, so he sold his own Daughter, Mestra, so he could buy more food.",
        "person": "Mestra",
        "colour": {
            "background": 0xac75d1,
            "circle": 0x8c52b3,
            "text": 0xFFFFFF
        }
    },
    "hi": {
        "value": 2,
        "text": "Hellp ",
        "person": "Hekwsb",
        "colour": {
            "background": 0x7ed2e0,
            "circle": 0x3b9cc4,
            "text": 0x000000
        }
    },
};

let availableFrames = Object.keys(frames);

function resizeCanvases() {
    const width = window.innerWidth / 2;
    const height = window.innerHeight;

    leftApp.renderer.resize(width, height);
    rightApp.renderer.resize(width, height);

    leftGraphics.clear();
    rightGraphics.clear();

    handleFrame(left, width, height);
    handleFrame(right, width, height);
}

function handleFrame(element, width, height) {
    if (!element.getAttribute('frame')) {
        element.setAttribute('frame', getFrame(availableFrames));
    }

    let frame = element.getAttribute('frame');
    let isLeft = element.id === 'left';

    let app = isLeft ? leftApp : rightApp;
    let graphics = isLeft ? leftGraphics : rightGraphics;

    graphics.removeChildren();

    app.renderer.backgroundColor = frames[frame].colour.background;

    graphics.clear();
    drawRandomCircles(graphics, 40, 75, 150, frames[frame].colour.circle, app.renderer);
    displayText(graphics, frame, frames[frame].colour.text, height / 2, width, width / 20);
    displayText(graphics, `Did ${frames[frame].person} have it worse?`, frames[frame].colour.text, height * 1.5, width, width / 25);
    displayText(graphics, frames[frame].text, frames[frame].colour.text, height, width, width / 35);

}


function getFrame(availableFrames) {
    const index = Math.floor(Math.random() * availableFrames.length);
    const frame = availableFrames[index];
    availableFrames.splice(index, 1);
    return frame;
}

function drawRandomCircles(graphics, numCircles, minRadius, maxRadius, colour, renderer) {
    const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const circles = [];

    for (let i = 0; i < numCircles; i++) {
        let radius = randomInt(minRadius, maxRadius);
        let x = randomInt(radius, renderer.width - radius);
        let y = randomInt(radius, renderer.height - radius);

        let overlapping = circles.some(circle => {
            const dx = x - circle.x;
            const dy = y - circle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            return distance < radius + circle.radius;
        });

        if (!overlapping) {
            graphics.beginFill(colour);
            graphics.drawCircle(x, y, radius);
            graphics.endFill();
            circles.push({ x, y, radius });
        }
    }
}

function displayText(graphics, textContent, textColor, yPos, xPos, fontSize) {
    let textStyle = new PIXI.TextStyle({
        fontFamily: 'Arial',
        align: 'center',
        fontSize: fontSize,
        wordWrap: true,
        wordWrapWidth: xPos / 1.5,
        fill: textColor
    });

    let text = new PIXI.Text(textContent, textStyle);
    text.x = (xPos - text.width) / 2;
    text.y = (yPos - text.height) * 0.5; 
    graphics.addChild(text);
}

resizeCanvases();

window.addEventListener('resize', resizeCanvases);
