/**
 * Created by visn on 2017/1/11.
 */
var SnakeLayer = cc.Layer.extend({
    ctor: function () {
        this._super();
        //初始化参数
        this.winSize = cc.winSize;
        this.stepSize = 1;
        this.showWordInfo();
        var pos = this.showSnake();
        this.showArrow();
        var bgSprite = new cc.Sprite(res.Bg_png);
        bgSprite.attr({
            x: this.winSize.width / 2,
            y: this.winSize.height / 2
        });

        this.addChild(bgSprite, 0);

        this.letters = [];
        this.positionList = [];

        this.letterA = new cc.Sprite(res.A_1_png);

        this.letterA.attr({x: 15, y: this.snakeRect[1] - 12, scale: (0.3, 0.3)});
        this.letters.push(this.letterA);
        this.letterB = new cc.Sprite(res.A_1_png);

        this.letterB.attr({x: 34, y: this.snakeRect[1] - 12, scale: (0.3, 0.3)});
        this.letters.push(this.letterB);
        this.addChild(this.letterA, 5);
        this.addChild(this.letterB, 5);

        this.positionList.push({x: 15, y: this.snakeRect[1] - 12});
        var snakeLayer = this;
        setInterval(function () {
            // snakeLayer.direct = parseInt(Math.random() * 4);
            cc.log(snakeLayer.direct);
        }, 2000);
        cc.log(this.snakeRect);
        this.scheduleUpdate();
        return true;
    },
    showWordInfo: function () {
        this.wordLabel = new cc.LabelTTF('xxxx', 'Arial', 38);
        this.wordSymbolLabel = new cc.LabelTTF('xxxx', 'Arial', 28);
        this.wordZHLabel = new cc.LabelTTF('xxxx', 'Arial', 28);

        var height = (this.winSize.height * 0.95);
        var width = this.winSize.width / 2;
        this.wordLabel.attr({x: width, y: height});
        this.wordSymbolLabel.attr({x: width, y: height - 25});
        this.wordZHLabel.attr({x: width, y: height - 47});

        this.addChild(this.wordLabel, 5);
        this.addChild(this.wordSymbolLabel, 5);
        this.addChild(this.wordZHLabel, 5);
    },
    showSnake: function () {
        var y = (this.winSize.height * 0.95) - 80;
        var width = this.winSize.width - 5;
        var height = this.winSize.height - 300;
        var draw = new cc.DrawNode();
        this.addChild(draw, 5, 'snake');

        cc.log(width / 10, height / 10);
        draw.drawRect(
            cc.p(5, y),
            cc.p(this.winSize.width - 5, 160),
            cc.color(0, 0, 0, 0),
            1,
            cc.color(0, 0, 0, 255)
        );

        return this.snakeRect = [5, y, this.winSize.width - 5, 160];
    },
    showArrow: function () {
        var width = this.winSize.width / 2;
        var height = 25;
        this.upArrow = new cc.Sprite(res.Arrow_png);
        this.upArrow.attr({x: width, y: height + 100, scale: (0.1, 0.1)});

        this.downArrow = new cc.Sprite(res.Arrow_png);
        this.downArrow.attr({x: width, y: height, scale: (0.1, 0.1)});

        this.leftArrow = new cc.Sprite(res.Arrow_png);
        this.leftArrow.attr({x: width - 50, y: height + 50, scale: (0.1, 0.1)});

        this.rightArrow = new cc.Sprite(res.Arrow_png);
        this.rightArrow.attr({x: width + 50, y: height + 50, scale: (0.1, 0.1)});

        this.addChild(this.upArrow, 5);
        this.addChild(this.downArrow, 5);
        this.addChild(this.leftArrow, 5);
        this.addChild(this.rightArrow, 5);
        var snakeLayer = this;
        cc.eventManager.addListener(cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget();
                var pos = touch.getLocation();
                if (cc.rectContainsPoint(target.getBoundingBox(), pos)) {
                    snakeLayer.direct = 2;
                    snakeLayer.positionList.push(snakeLayer.letters[0].getPosition());
                }
            }
        }), this.upArrow);
        cc.eventManager.addListener(cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget();
                var pos = touch.getLocation();
                if (cc.rectContainsPoint(target.getBoundingBox(), pos)) {
                    snakeLayer.direct = 3;
                    snakeLayer.positionList.push(snakeLayer.letters[0].getPosition());
                }
            }
        }), this.downArrow);
        cc.eventManager.addListener(cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget();
                var pos = touch.getLocation();
                if (cc.rectContainsPoint(target.getBoundingBox(), pos)) {
                    snakeLayer.direct = 0;
                    snakeLayer.positionList.push(snakeLayer.letters[0].getPosition());
                }
            }
        }), this.rightArrow);
        cc.eventManager.addListener(cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget();
                var pos = touch.getLocation();
                if (cc.rectContainsPoint(target.getBoundingBox(), pos)) {
                    snakeLayer.direct = 1;
                    snakeLayer.positionList.push(snakeLayer.letters[0].getPosition());
                }
            }
        }), this.leftArrow);

    },
    direct: 2,  //0 right    1 left     2 up    3 down
    update: function () {
        var len = this.letters.length;
        for (var i = 0; i < len; i++) {
            var x = this.letters[i].getPositionX();
            var y = this.letters[i].getPositionY();
            if (x > this.snakeRect[2] - 10) {
                this.direct = 1;
                // this.unscheduleUpdate();
            }

            if (x < this.snakeRect[0] + 10) {
                this.direct = 0;
                // this.unscheduleUpdate();
            }

            if (y > this.snakeRect[1] - 10) {
                this.direct = 3;
                // this.unscheduleUpdate();
            }

            if (y < this.snakeRect[3] + 10) {
                this.direct = 2;
                // this.unscheduleUpdate();
            }


            if (this.direct == 0) this.letters[i].setPositionX(x + this.stepSize);
            if (this.direct == 1) this.letters[i].setPositionX(x - this.stepSize);
            if (this.direct == 2) this.letters[i].setPositionY(y + this.stepSize);
            if (this.direct == 3) this.letters[i].setPositionY(y - this.stepSize);
        }

    }
});
