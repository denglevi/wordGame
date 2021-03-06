/**
 * Created by visn on 2017/1/4.
 */
var MainLayer = cc.Layer.extend({
    sprite: null,
    wordInfo: null,
    keyword: '',
    ctor: function () {
        this._super();

        this.getWordInfo();
        var size = cc.winSize;

        this.clearLabel = new cc.LabelTTF("reset", "Arial", 38);
        this.clearLabel.x = size.width - 55;
        this.clearLabel.y = size.height / 10;

        var addLabel = new cc.LabelTTF("add", "Arial", 38);
        addLabel.x = size.width / 2 - 155;
        addLabel.y = size.height / 10;

        var bgSprite = new cc.Sprite(res.Bg_png);
        bgSprite.attr({
            x: size.width / 2,
            y: size.height / 2
        });
        if (window.localStorage && window.localStorage.getItem('scoreData')) {
            // mainLayer.score = (Array(6).join(0) + mainLayer.score).slice(-6);
            this.score = JSON.parse(window.localStorage.getItem('scoreData')).score;
            var currentTime = new Date().getTime() / 1000;
            if (currentTime - JSON.parse(window.localStorage.getItem('scoreData')).time > 86400) {
                this.score = this.score - 20;
                this.score = (Array(6).join(0) + this.score).slice(-6);
                var data = {
                    score: this.score,
                    time: JSON.parse(window.localStorage.getItem('scoreData')).time
                }
                window.localStorage.setItem('scoreData', JSON.stringify(data));
            }
        } else {
            this.score = "000000";
        }
        this.scoreLabel = new cc.LabelTTF("SCORE:" + this.score, "Arial", 18);
        var scoreContentSize = this.scoreLabel.getContentSize();
        // cc.log(scoreContentSize);
        this.scoreLabel.x = size.width - scoreContentSize.width / 2 - 10;
        this.scoreLabel.y = size.height - scoreContentSize.height;


        // this.addChild(this.clearLabel, 5);
        this.addChild(this.scoreLabel, 5);
        // this.addChild(addLabel, 5);
        this.addChild(bgSprite, 0);

        this.showKeyBoard();
        return true;
    },
    getWordInfo: function () {
        // cc.log(1253);
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.open("GET", res.Host_str + "/getWordList");
        xhr.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
        var mainLayer = this;
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status <= 207)) {
                var httpStatus = xhr.statusText;
                var response = xhr.responseText;
                // try{
                mainLayer.wordInfo = JSON.parse(response);
                if (mainLayer.wordInfo.length <= 0) {
                    var size = cc.winSize;
                    var noticeLabel = new cc.LabelTTF('获取数据错误', "Arial", 38);
                    noticeLabel.x = size.width / 2;
                    noticeLabel.y = size.height / 2;
                    mainLayer.addChild(noticeLabel, 1000);
                    return false;
                }
                mainLayer.showWordInfo(mainLayer.wordInfo[0]);
                // }catch (e){
                //     console.error("无法解析服务器的响应结果: \n" + response);
                // }

            }
        };
        xhr.send();
    },
    showWordInfo: function (obj) {
        cc.audioEngine.playEffect(res.Host_str + '/' + obj.soundFilePath);
        var size = cc.winSize;
        var mainLayer = this;
        var wordLabel = new cc.LabelTTF(obj.word, "Arial", 38);
        wordLabel.x = size.width / 2;
        wordLabel.y = size.height / 2 + 200;
        this.addChild(wordLabel, 5);
        this.wordLabel = wordLabel;
        this.wordObj = obj;
        var wordContentSize = wordLabel.getContentSize();
        // cc.log(wordContentSize);
        var wordSymbolLabel = new cc.LabelTTF('[' + obj.symbol + ']', "Arial", 20);
        wordSymbolLabel.x = size.width / 2;
        wordSymbolLabel.y = size.height / 2 + 175;
        this.addChild(wordSymbolLabel, 5);
        this.wordSymbolLabel = wordSymbolLabel;

        var soundSprite = new cc.Sprite(res.Sound_png);
        // cc.log(wordSymbolLabel.getContentSize().width);
        soundSprite.x = (size.width + wordSymbolLabel.getContentSize().width) / 2 + 10;
        soundSprite.y = size.height / 2 + 173;
        soundSprite.scale = (0.6, 0.6);
        this.addChild(soundSprite, 50000);
        this.soundSprite = soundSprite;
        cc.eventManager.addListener(cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget();
                var pos = touch.getLocation();
                if (cc.rectContainsPoint(target.getBoundingBox(), pos)) {
                    cc.audioEngine.playEffect(res.Host_str + '/' + obj.soundFilePath);
                    return false;
                }
            }
        }), this.soundSprite);

        var len = obj.wordZH.length;
        var wordNum = parseInt(size.width / 20);
        var wordLineNum = parseInt(len / wordNum) - 1;
        var offsetHeight = 140 - wordLineNum * 13;
        // cc.log(wordNum);
        var newWordZH = '';
        if (len > wordNum) {
            for (var i = 0; i < len; i++) {
                if (i % wordNum == 0 && i != 0) newWordZH += obj.wordZH[i] + "\n";
                else newWordZH += obj.wordZH[i];
            }
        } else {
            newWordZH = obj.wordZH;
        }
        var wordZHLabel = new cc.LabelTTF(newWordZH, "Arial", 20);
        wordZHLabel.x = size.width / 2;
        wordZHLabel.y = size.height / 2 + offsetHeight;
        this.addChild(wordZHLabel, 5);
        this.wordZHLabel = wordZHLabel;

        var len = obj.sentence.length;
        var wordNum = parseInt(size.width / 10);
        var sentenceLineNum = parseInt(len / wordNum) - 1;
        // cc.log(wordLineNum, sentenceLineNum);
        var offsetHeight = 140 - this.wordZHLabel.getContentSize().height;
        var newSentence = '';
        if (len > wordNum) {
            for (var i = 0; i < len; i++) {
                if (i % wordNum == 0 && i != 0) newSentence += obj.sentence[i] + "\n";
                else newSentence += obj.sentence[i];
            }
        } else {
            newSentence = obj.sentence;
        }

        var sentenceLabel = new cc.LabelTTF(newSentence, "Arial", 20);
        sentenceLabel.x = size.width / 2;
        sentenceLabel.y = size.height / 2 + offsetHeight;
        this.addChild(sentenceLabel, 5);
        this.sentenceLabel = sentenceLabel;

        var sentnceSoundSprite = new cc.Sprite(res.Sound_png);
        sentnceSoundSprite.x = size.width/2;
        sentnceSoundSprite.y = size.height / 2 + (140-this.wordZHLabel.getContentSize().height-this.sentenceLabel.getContentSize().height);
        sentnceSoundSprite.scale = (0.6, 0.6);
        this.addChild(sentnceSoundSprite, 50000);
        this.sentnceSoundSprite = sentnceSoundSprite;

        cc.eventManager.addListener(cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget();
                var pos = touch.getLocation();
                if (cc.rectContainsPoint(target.getBoundingBox(), pos)) {
                    cc.audioEngine.playEffect(res.Host_str + '/' + obj.sentenceSoundFilePath);
                    return false;
                }
            }
        }), this.sentnceSoundSprite);

        var len = obj.sentenceZH.length;
        var wordNum = parseInt(size.width / 20);
        var sentenceZHLineNum = parseInt(len / wordNum) - 1;
        var offsetHeight = 150 - this.wordZHLabel.getContentSize().height-this.sentenceLabel.getContentSize().height-this.sentnceSoundSprite.getContentSize().height;
        var newSentenceZH = '';
        if (len > wordNum) {
            for (var i = 0; i < len; i++) {
                if (i % wordNum == 0 && i != 0) newSentenceZH += obj.sentenceZH[i] + "\n";
                else newSentenceZH += obj.sentenceZH[i];
            }
        } else {
            newSentenceZH = obj.sentenceZH;
        }

        var sentenceZHLabel = new cc.LabelTTF(newSentenceZH, "Arial", 20);
        sentenceZHLabel.x = size.width / 2;
        sentenceZHLabel.y = size.height / 2 + offsetHeight;
        this.addChild(sentenceZHLabel, 5);
        this.sentenceZHLabel = sentenceZHLabel;


        // var wordZH = obj.wordZH.split(',');
        // var testWord = obj.word;
        // obj.word = obj.word+'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        var letterList = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

        var valNum = setInterval(function () {
            var i = parseInt(Math.random() * obj.word.length);
            var r = parseInt(Math.random() * 255);
            var g = parseInt(Math.random() * 255);
            var b = parseInt(Math.random() * 255);
            var random_num = parseInt(50 + Math.random() * 350);
            var num = new cc.LabelTTF(obj.word[i].toUpperCase(), "Helvetica-Bold", 60);
            num.setFontFillColor(cc.color(r, g, b, 0));
            num.x = random_num;
            num.y = 100;
            num.scale = (0.3, 0.3);
            mainLayer.addChild(num, 500, 100 + letterList.indexOf(obj.word[i].toUpperCase()));

            var scale = cc.scaleTo(1, 1);
            var fadeOut = cc.fadeOut(3);
            var rotate = cc.rotateBy(parseInt(Math.random() * 5), 360 + parseInt(Math.random() * 360));
            var func = cc.callFunc(function (data) {
                data.removeFromParent(true);
            }, mainLayer, num);
            var move = cc.moveTo(2, num.x, num.y + 400);

            num.runAction(scale);
            num.runAction(fadeOut);
            num.runAction(rotate);
            var seq = cc.sequence(move, func);
            num.runAction(seq);
            // cc.eventManager.addListener(cc.EventListener.create({
            //     event: cc.EventListener.TOUCH_ONE_BY_ONE,
            //     onTouchBegan: function (touch, event) {
            //         var target = event.getCurrentTarget();
            //         var pos = touch.getLocation();
            //
            //         if (cc.rectContainsPoint(target.getBoundingBox(), pos)) {
            //             target.removeFromParent(true);
            //             var moveOutSprite = new cc.Sprite(res.Beams_png, cc.rect(160, 209, 40, 90));
            //             moveOutSprite.attr({
            //                 x: pos.x,
            //                 y: pos.y
            //             });
            //             var scale = cc.scaleTo(0.5, 0.1, 0.1);
            //             var move = cc.moveTo(0.5, moveOutSprite.x, moveOutSprite.y + 400);
            //             var func = cc.callFunc(function (data) {
            //                 data.removeFromParent(true);
            //             }, moveOutSprite, null);
            //             var seq = cc.sequence(move, func);
            //             moveOutSprite.runAction(seq);
            //             moveOutSprite.runAction(scale);
            //
            //             mainLayer.addChild(moveOutSprite, 1000);
            //
            //             keyword += num.getString();
            //             // cc.log(keyword);
            //             if (keyword.toLowerCase() == obj.word.toLowerCase()) {
            //                 wordLabel.removeFromParent(true);
            //                 wordZHLabel.removeFromParent(true);
            //                 wordSymbolLabel.removeFromParent(true);
            //                 mainLayer.score = parseInt(mainLayer.score) + 10;
            //                 mainLayer.score = (Array(6).join(0) + mainLayer.score).slice(-6);
            //                 setTimeout(function () {
            //                     mainLayer.scoreLabel.setString("SCORE:" + mainLayer.score);
            //                 }, 2000);
            //                 var flareSprite = new cc.Sprite(res.Flare_png);
            //                 flareSprite.attr({
            //                     x: wordLabel.x,
            //                     y: wordLabel.y,
            //                     scale: (0.6, 0.6)
            //                 });
            //
            //                 var controlPoints = [cc.p(wordLabel.x - 200, wordLabel.y), cc.p(wordLabel.x - 100, wordLabel.y + 50), cc.p(wordLabel.x + 150, wordLabel.y + 150)];
            //                 var func = cc.callFunc(function (obj) {
            //                     obj.removeFromParent(true);
            //                 }, flareSprite, null);
            //                 var scale = cc.scaleTo(2, 0.1, 0.1);
            //                 var bezierTo = cc.bezierTo(2, controlPoints);
            //                 var rep = cc.sequence(bezierTo, func);
            //                 var rotate = cc.rotateBy(2, 720);
            //
            //                 flareSprite.runAction(rep);
            //                 flareSprite.runAction(scale);
            //                 flareSprite.runAction(rotate);
            //                 mainLayer.addChild(flareSprite, 15000);
            //
            //                 keyword = '';
            //                 clearInterval(valNum);
            //                 var indexNum = mainLayer.wordInfo.indexOf(obj);
            //                 if (indexNum == mainLayer.wordInfo.length - 1) {
            //                     if (!window.localStorage) {
            //                         return false;
            //                     }
            //
            //                     var time = new Date().getTime() / 1000;
            //
            //                     var data = {
            //                         score: mainLayer.score,
            //                         time: time
            //                     };
            //
            //                     window.localStorage.setItem('scoreData', JSON.stringify(data));
            //                     alert("恭喜你,完成任务!");
            //                     return true;
            //                 } else {
            //                     var wordObj = mainLayer.wordInfo[indexNum + 1];
            //                     mainLayer.showWordInfo(wordObj);
            //                 }
            //             }
            //             return true;
            //         }
            //     }
            // }), num);
        }, 300);
        this.valNum = valNum;
        // cc.eventManager.addListener(cc.EventListener.create({
        //     event: cc.EventListener.TOUCH_ONE_BY_ONE,
        //     swallowTouches: true,
        //     onTouchBegan: function (touch, event) {
        //         var target = event.getCurrentTarget();
        //         var pos = touch.getLocation();
        //
        //         if (cc.rectContainsPoint(target.getBoundingBox(), pos)) {
        //             keyword = "";
        //         }
        //     }
        // }), mainLayer.clearLabel);
    },
    showKeyBoard: function () {
        var winSize = cc.winSize;

        var spriteSize = parseInt(winSize.width / 10);
        var scaleSize = (spriteSize / 70).toFixed(2);

        var letters = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
        var xRange = spriteSize / 2;
        for (var i = 0; i < letters.length; i++) {
            var letter = new LetterSprite(eval("res." + letters[i] + '_1_png'), letters[i], scaleSize, this);
            var x = i * spriteSize + xRange;
            letter.x = x;
            letter.y = 120;
            this.addChild(letter, 5);
        }
        var letters = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
        var xRange = (spriteSize * 2) / 2;
        for (var i = 0; i < letters.length; i++) {
            var letter = new LetterSprite(eval("res." + letters[i] + '_1_png'), letters[i], scaleSize, this);
            var x = i * spriteSize + xRange;
            letter.x = x;
            letter.y = 80;
            this.addChild(letter, 5);
        }

        var letters = ['Z', 'X', 'C', 'V', 'B', 'N', 'M'];
        var xRange = (spriteSize * 4) / 2;
        for (var i = 0; i < letters.length; i++) {
            var letter = new LetterSprite(eval("res." + letters[i] + '_1_png'), letters[i], scaleSize, this);
            var x = i * spriteSize + xRange;
            letter.x = x;
            letter.y = 40;
            this.addChild(letter, 5);
        }

    }
});