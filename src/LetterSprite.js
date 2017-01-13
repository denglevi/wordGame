/**
 * Created by visn on 2017/1/4.
 */
var LetterSprite = cc.Sprite.extend({
    ctor: function (fileName, letter, scaleSize, obj) {
        this._super(fileName);

        this.scale = (scaleSize, scaleSize);
        this.letter = letter;
        this.mainLayer = obj;
        var letterSprite = this;
        var letterList = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        cc.eventManager.addListener(cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget();
                var pos = touch.getLocation();
                if (cc.rectContainsPoint(target.getBoundingBox(), pos)) {

                    var letterObj = obj.getChildByTag(100 + letterList.indexOf(letterSprite.letter));
                    if (letterObj == null){
                        cc.audioEngine.playEffect(res.Fail_wav);
                        return;
                    }
                    var letterPos = letterObj.getPosition();
                    letterObj.removeFromParent(true);
                    var moveOutSprite = new cc.Sprite(res.Beams_png, cc.rect(160, 209, 40, 90));
                    moveOutSprite.attr({
                        x: letterPos.x,
                        y: letterPos.y
                    });
                    var scale = cc.scaleTo(0.5, 0.1, 0.1);
                    var move = cc.moveTo(0.5, moveOutSprite.x, moveOutSprite.y + 400);
                    var func = cc.callFunc(function (data) {
                        data.removeFromParent(true);
                    }, moveOutSprite, null);
                    cc.audioEngine.playEffect(res.Success_wav);
                    var seq = cc.sequence(move, func);
                    moveOutSprite.runAction(seq);
                    moveOutSprite.runAction(scale);

                    obj.addChild(moveOutSprite, 1000);

                    letterSprite.showFlare(letterSprite.letter);
                }
            }
        }), this);
        return true;
    },
    showFlare: function (str) {
        var mainLayer = this.mainLayer;
        this.mainLayer.keyword += str;
        // cc.log(this.mainLayer.keyword);
        if (this.mainLayer.keyword.toLowerCase() == this.mainLayer.wordObj.word.toLowerCase()) {
            this.mainLayer.wordLabel.removeFromParent(true);
            this.mainLayer.wordZHLabel.removeFromParent(true);
            this.mainLayer.wordSymbolLabel.removeFromParent(true);
            this.mainLayer.soundSprite.removeFromParent(true);
            this.mainLayer.sentenceSoundSprite.removeFromParent(true);
            this.mainLayer.sentenceLable.removeFromParent(true);
            this.mainLayer.sentenceZHLable.removeFromParent(true);
            this.mainLayer.score = parseInt(this.mainLayer.score) + 10;
            this.mainLayer.score = (Array(6).join(0) + this.mainLayer.score).slice(-6);
            setTimeout(function () {
                mainLayer.scoreLabel.setString("SCORE:" + mainLayer.score);
            }, 2000);
            var flareSprite = new cc.Sprite(res.Flare_png);
            flareSprite.attr({
                x: this.mainLayer.wordLabel.x,
                y: this.mainLayer.wordLabel.y,
                scale: (0.6, 0.6)
            });
            cc.audioEngine.playEffect(res.Success_word_wav);
            var controlPoints = [cc.p(this.mainLayer.wordLabel.x - 200, this.mainLayer.wordLabel.y), cc.p(this.mainLayer.wordLabel.x - 100, this.mainLayer.wordLabel.y + 50), cc.p(this.mainLayer.wordLabel.x + 150, this.mainLayer.wordLabel.y + 150)];
            var func = cc.callFunc(function (obj) {
                obj.removeFromParent(true);
            }, flareSprite, null);
            var scale = cc.scaleTo(2, 0.1, 0.1);
            var bezierTo = cc.bezierTo(2, controlPoints);
            var rep = cc.sequence(bezierTo, func);
            var rotate = cc.rotateBy(2, 720);

            flareSprite.runAction(rep);
            flareSprite.runAction(scale);
            flareSprite.runAction(rotate);
            this.mainLayer.addChild(flareSprite, 15000);

            this.mainLayer.keyword = '';
            clearInterval(this.mainLayer.valNum);
            var indexNum = this.mainLayer.wordInfo.indexOf(this.mainLayer.wordObj);
            if (indexNum == this.mainLayer.wordInfo.length - 1) {
                if (!window.localStorage) {
                    return false;
                }

                var time = new Date().getTime() / 1000;

                var data = {
                    score: this.mainLayer.score,
                    time: time
                };

                window.localStorage.setItem('scoreData', JSON.stringify(data));
                alert("恭喜你,完成任务!");
                return true;
            } else {
                var wordObj = this.mainLayer.wordInfo[indexNum + 1];
                this.mainLayer.showWordInfo(wordObj);
            }
        }
    }
});