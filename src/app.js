var MainScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new BeginLayer();
        this.addChild(layer);
    }
});

