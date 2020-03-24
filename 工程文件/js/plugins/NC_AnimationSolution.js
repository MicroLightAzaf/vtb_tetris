// Ҳ���Ҹ����Ͳ��ã�Ҳû�б�Ҫд��������
// CommonAnimation ͼƬ·����img\picture\Animation\
// SequenceAnimation ͼƬ·����img\picture\sequenceAnimation\

function CommonAnimation() {
    this.initialize.apply(this, arguments);
}

CommonAnimation.prototype = Object.create(Sprite.prototype);
CommonAnimation.prototype.constructor = CommonAnimation;

CommonAnimation.prototype.initialize = function (name, horizontal_cells, vertical_cells) {
    Sprite.prototype.initialize.call(this);
    this._horizontal_cells = horizontal_cells;
    this._vertical_cells = vertical_cells;
    this.Xcursor = 0;
    this.Ycursor = 0;
    this.curSprite = new Sprite();
    this.curSprite.bitmap = ImageManager.loadPicture('Animation\\'+name)
    this.addChild(this.curSprite);
}

CommonAnimation.prototype.update = function () {
    Sprite.prototype.update.call(this);
    this.imageWidth = this.curSprite.bitmap.width / this._horizontal_cells
    this.imageHeight = this.curSprite.bitmap.height / this._vertical_cells
    this.curSprite.setFrame(this.Xcursor, this.Ycursor, this.imageWidth, this.imageHeight)
    this.Xcursor += this.imageWidth
    if (this.Xcursor == this.curSprite.bitmap.width) {
        this.Xcursor = 0;
        this.Ycursor += this.imageHeight;
    }
    if (this.Ycursor == this.curSprite.bitmap.height) {
        this.Xcursor = 0;
        this.Ycursor = 0;
    }
}

function SequenceAnimation() {
    this.initialize.apply(this, arguments);
}

SequenceAnimation.prototype = Object.create(Sprite.prototype);
SequenceAnimation.prototype.constructor = SequenceAnimation;

SequenceAnimation.prototype.initialize = function (name, FinalNumber, framedigits, initialNumber, delay) {
    Sprite.prototype.initialize.call(this);
    this.delay = delay||0
    this.delay_count = 0;
    this.frameNumber = FinalNumber
    this.frames = [];
    if (!initialNumber) {
        initialNumber = 0;
    }
    for (i = initialNumber; i <= FinalNumber; i++) {
        curdigits = i.toString().split("");
        suffix = ''
        if (framedigits - curdigits.length > 0) {
            for (j = 0; j < (framedigits - curdigits.length); j++) {
                suffix += "0";
            }
        }
        suffix += i;
        this.frames.push(ImageManager.loadPicture("sequenceAnimation\\" + name + suffix));
    }
    this.curSprite = new Sprite();
    this.addChild(this.curSprite)
    this.cursor = 0;
    this.completed = false;
}

SequenceAnimation.prototype.update = function () {
    Sprite.prototype.update.call(this);
    this.delay_count++;
    if (this.delay_count >= (this.delay+1)) {
        this.curSprite.bitmap = this.frames[this.cursor];
        this.cursor += 1;
        if (this.cursor >= this.frameNumber) {
            this.cursor = 0;
            this.completed = true
        }
        this.delay_count=0;
    }
}

SequenceAnimation.prototype.isCompleted = function () {
    return this.completed;
}