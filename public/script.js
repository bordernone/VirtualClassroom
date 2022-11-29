let p5Instance;
const windowHeight = window.innerHeight;
const windowWidth = window.innerWidth;

window.onload = function () {
    p5Instance = new p5(s, "container");
};

const MODELS = {
    GUY: {
        model: "assets/guy/model.obj",
        texture: "assets/guy/text.bmp",
    },
    LADY: {
        model: "assets/lady/Woman.obj",
        texture: "assets/lady/woman.png",
    },
};

const s = (sketch) => {
    let guyModel, ladyModel;
    let guyTexture, ladyTexture;
    let guy1, guy2, lady1, lady2;
    let camera;

    let rows = 2;
    let cols = 2;
    let gridStartX = -100;
    let gridStartY = -100;
    let gridWidth = 250;
    let gridHeight = 250;

    let grid = [];

    sketch.setup = () => {
        sketch.createCanvas(windowWidth, windowHeight, sketch.WEBGL);

        // Load models
        // guyModel = sketch.loadModel(MODELS.GUY.model, true);
        ladyModel = sketch.loadModel(MODELS.LADY.model, true);

        // Load textures
        // guyTexture = sketch.loadImage(MODELS.GUY.texture);
        ladyTexture = sketch.loadImage(MODELS.LADY.texture);

        lady1 = new Avatar(sketch, 0, 0, 0, { model: ladyModel, texture: ladyTexture });

        camera = sketch.createCamera();
    };

    sketch.draw = () => {
        camera.setPosition(0, 0, 500);
        camera.lookAt(0, 0, 0);

        sketch.background(250);

        lady1.draw();
    };
};

class Avatar {
    constructor(sketch, x, y, z, modelTex) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.sketch = sketch;

        this.model = modelTex.model;
        this.texture = modelTex.texture;
    }

    draw(camera) {
        this.sketch.push();
        this.sketch.noStroke();
        this.sketch.translate(this.x, this.y, this.z);
        this.sketch.rotateX(this.sketch.frameCount * 0.01);
        this.sketch.rotateY(this.sketch.frameCount * 0.01);

        this.sketch.texture(this.texture);
        this.sketch.model(this.model);
        this.sketch.pop();
    }
}
