/**
 * Created by visn on 2017/1/4.
 */
var BeginLayer = cc.Layer.extend({
    ctor:function(){
        this._super();

        var size = cc.winSize;

        var beginLabel = new cc.LabelTTF("开始", "Arial", 38);

        beginLabel.x = size.width / 2;
        beginLabel.y = size.height / 2;
        this.addChild(beginLabel, 5);

        var bgSprite = new cc.Sprite(res.Bg_png);
        bgSprite.attr({
            x: size.width / 2,
            y: size.height / 2
        });
        this.addChild(bgSprite, 0);

        var currentLayer = this;
        var beginLabelListener = cc.EventListener.create({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: true,
                onTouchBegan: function (touch, event) {
                    var target = event.getCurrentTarget();
                    var pos = touch.getLocation();
                    if( cc.rectContainsPoint(target.getBoundingBox(), pos) ) {
                        var mainLayer = new MainLayer();
                        var scene = cc.director.getRunningScene();
                        scene.addChild(mainLayer,100);
                        currentLayer.removeFromParent(true);
                        return false;
                    }
                }
            });
        cc.eventManager.addListener(beginLabelListener,beginLabel);
    }
});