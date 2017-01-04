/**
 * Created by visn on 2017/1/4.
 */
var MainLayer = cc.Layer.extend({
    sprite:null,
    ctor:function(){
        this._super();
        var size = cc.winSize;

        var mainLabel = new cc.LabelTTF("主界面", "Arial", 38);

        mainLabel.x = size.width / 2;
        mainLabel.y = size.height / 2+200;
        this.addChild(mainLabel, 5);

        var bgSprite = new cc.Sprite(res.Bg_png);
        bgSprite.attr({
            x:0,
            y:0,

        });
        this.addChild(bgSprite,100);
        return true;
    }
});