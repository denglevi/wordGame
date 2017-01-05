/**
 * Created by visn on 2017/1/4.
 */
var MainLayer = cc.Layer.extend({
    sprite: null,
    wordInfo:null,
    keyword:'',
    ctor: function () {
        this._super();

        this.getWordInfo();
        var size = cc.winSize;

        this.clearLabel = new cc.LabelTTF("clear", "Arial", 38);
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

        this.addChild(this.clearLabel, 5);
        this.addChild(addLabel, 5);
        this.addChild(bgSprite, 0);

        return true;
    },
    getWordInfo:function(){
        cc.log(1253);
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.open("GET", "http://wordgame.denglevi.com/getWordList");
        xhr.setRequestHeader("Content-Type","text/plain;charset=UTF-8");
        var mainLayer = this;
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status <= 207)) {
                var httpStatus = xhr.statusText;
                var response = xhr.responseText;
                // try{
                    mainLayer.wordInfo = JSON.parse(response);
                    if(mainLayer.wordInfo.length <= 0){
                        var size = cc.winSize;
                        var noticeLabel = new cc.LabelTTF('获取数据错误', "Arial", 38);
                        noticeLabel.x = size.width / 2;
                        noticeLabel.y = size.height / 2;
                        mainLayer.addChild(noticeLabel,1000);
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
    showWordInfo:function(obj){
        cc.audioEngine.playEffect('http://wordgame.denglevi.com/assets/actor.wav');
        var size = cc.winSize;
        var mainLayer = this;
        var wordLabel = new cc.LabelTTF(obj.word, "Arial", 38);
        wordLabel.x = size.width / 2;
        wordLabel.y = size.height / 2 + 200;
        this.addChild(wordLabel, 5);

        // var wordZH = obj.wordZH.split(',');
        // obj.word = obj.word+'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        var keyword = '';
        var valNum = setInterval(function(){
            var i = parseInt(Math.random()*obj.word.length);
            var r = parseInt(Math.random() * 255);
            var g = parseInt(Math.random() * 255);
            var b = parseInt(Math.random() * 255);
            var random_num = parseInt(50 + Math.random() * 350);
            var num = new cc.LabelTTF(obj.word[i], "Helvetica-Bold", 60);
            num.setFontFillColor(cc.color(r, g, b, 0));
            num.x = random_num;
            num.y = 100;
            num.scale = (0.3, 0.3);
            mainLayer.addChild(num, 500);

            var scale = cc.scaleTo(1, 1);
            var fadeOut = cc.fadeOut(3);
            var rotate = cc.rotateBy(parseInt(Math.random()*5),360+parseInt(Math.random()*360));
            var func = cc.callFunc(function (data) {
                data.removeFromParent(true);
            }, mainLayer, num);
            var move = cc.moveTo(2, num.x, num.y + 400);

            num.runAction(scale);
            num.runAction(fadeOut);
            num.runAction(rotate);
            var seq = cc.sequence(move, func);
            num.runAction(seq);

            cc.eventManager.addListener(cc.EventListener.create({
                event:cc.EventListener.TOUCH_ONE_BY_ONE,
                onTouchBegan:function(touch,event){
                    var target = event.getCurrentTarget();
                    var pos = touch.getLocation();

                    if (cc.rectContainsPoint(target.getBoundingBox(), pos)) {
                        keyword += num.getString();
                        cc.log(keyword);
                        if (keyword.toLowerCase() == obj.word.toLowerCase()) {
                            wordLabel.removeFromParent(true);
                            keyword = '';
                            clearInterval(valNum);
                            var indexNum = mainLayer.wordInfo.indexOf(obj);
                            if(indexNum == mainLayer.wordInfo.length-1){
                                cc.log("完成任务");
                                return false;
                            }else{
                                var wordObj = mainLayer.wordInfo[indexNum+1]
                                mainLayer.showWordInfo(wordObj);
                            }
                        }
                        return true;
                    }
                }
            }),num);
        },500);

        cc.eventManager.addListener(cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget();
                var pos = touch.getLocation();

                if (cc.rectContainsPoint(target.getBoundingBox(), pos)) {
                    keyword = "";
                }
            }
        }),mainLayer.clearLabel);
    }
});