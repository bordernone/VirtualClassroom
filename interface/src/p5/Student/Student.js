class Student {
    constructor({ sketch, IMAGES }, x, y, name) {
        this.x = x;
        this.y = y;
        this.sketch = sketch;
        this.name = name;
        this.IMAGES = IMAGES;
        this.state = "idle";

        this.width = 150;
        this.height = 150;
    }

    draw() {
        if (this.state === "idle") {
            this.sketch.image(
                this.IMAGES.character_idle,
                this.x,
                this.y,
                this.width,
                this.height
            );
        } else if (this.state === "arm_raised") {
            this.sketch.image(
                this.IMAGES.character_arm_raised,
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

    raiseArm() {
        this.state = "arm_raised";
    }

    lowerArm() {
        this.state = "idle";
    }
}


export default Student;