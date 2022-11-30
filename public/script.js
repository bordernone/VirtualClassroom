let p5Instance;
const windowHeight = window.innerHeight;
const windowWidth = window.innerWidth;

let ASSET_LOCATION = {
    images: {
        character_idle: "assets/characters/character_idle.png",
        character_arm_raised: "assets/characters/character_arm_raised.png",
    },
};

let IMAGES = {};

window.onload = function () {
    p5Instance = new p5(s, "container");
};

const s = (sketch) => {
    let characters = [];

    sketch.preload = () => {
        IMAGES.character_idle = sketch.loadImage(
            ASSET_LOCATION.images.character_idle
        );
        IMAGES.character_arm_raised = sketch.loadImage(
            ASSET_LOCATION.images.character_arm_raised
        );
    };

    sketch.setup = () => {
        sketch.createCanvas(windowWidth, windowHeight);
        sketch.frameRate(60);

        // Row 1
        let student1 = new Student(sketch, 100, 100, "Student 1");
        let student2 = new Student(sketch, 250, 100, "Student 2");
        let student3 = new Student(sketch, 400, 100, "Student 3");
        let student4 = new Student(sketch, 550, 100, "Student 4");
        // Row 2
        let student5 = new Student(sketch, 100, 250, "Student 5");
        let student6 = new Student(sketch, 250, 250, "Student 6");
        let student7 = new Student(sketch, 400, 250, "Student 7");
        let student8 = new Student(sketch, 550, 250, "Student 8");

        characters.push(student1);
        characters.push(student2);
        characters.push(student3);
        characters.push(student4);
        characters.push(student5);
        characters.push(student6);
        characters.push(student7);
        characters.push(student8);
    };

    sketch.draw = () => {
        sketch.background(255);

        characters.forEach((character) => {
            character.draw();
        });
    };
};

class Student {
    constructor(sketch, x, y, name) {
        this.x = x;
        this.y = y;
        this.sketch = sketch;
        this.name = name;
        this.state = "idle";

        this.width = 150;
        this.height = 150;
    }

    draw() {
        if (this.state === "idle") {
            this.sketch.image(
                IMAGES.character_idle,
                this.x,
                this.y,
                this.width,
                this.height
            );
        } else if (this.state === "arm_raised") {
            this.sketch.image(
                IMAGES.character_arm_raised,
                this.x,
                this.y,
                this.width,
                this.height
            );
        }

        this.addText(this.name);
    }

    addText(text) {
        let offsetX = this.width / 2;
        let offsetYPercent = 60;
        let offsetY = (this.height / 100) * offsetYPercent;
        let fontSizePercent = 8;
        let fontSize = (this.height / 100) * fontSizePercent;

        // Trim text if too long
        if (text.length > 10) {
            text = text.substring(0, 10) + "...";
        }

        // Center text
        this.sketch.textAlign(this.sketch.CENTER, this.sketch.CENTER);
        this.sketch.textSize(fontSize);
        this.sketch.text(text, this.x + offsetX, this.y + offsetY);
    }
}
