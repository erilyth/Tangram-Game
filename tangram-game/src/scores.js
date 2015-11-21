var ScoreLayer = cc.Layer.extend({
	ctor:function () {
		//////////////////////////////
		// 1. super init first
		this._super();
		var size = cc.winSize;
		var background = new cc.Sprite.create(res.Background_png);
		background.setPosition(new cc.p(0,0));
		background.setScale(size.width/background.getContentSize().width, size.height/background.getContentSize().height);
		background.setAnchorPoint(new cc.p(0,0));
		this.addChild(background);
		var ls= cc.sys.localStorage;
		var value;
		var ls = cc.sys.localStorage;
		if (ls.getItem("#playerNames") == null){
			var list1 = new Array(100);
			var list2 = new Array(100);
			ls.setItem("#playerNames",JSON.stringify(list1));
			ls.setItem("#playerScores",JSON.stringify(list2));
		}
		var playerNames = JSON.parse(ls.getItem("#playerNames"));
		var playerScores = JSON.parse(ls.getItem("#playerScores"));
		//cc.log(playerNames);
		var temp;
		var start=0;
		for(temp=0;temp<playerNames.length;temp++){
			if(playerNames[temp]!=null){
				var label = new cc.LabelTTF(playerNames[temp]+ " " +playerScores[temp],"Arial");
				label.setFontSize(15);
				label.setPosition(new cc.p(size.width/2,size.height/2-50+start*20));
				this.addChild(label);
				start+=1;
			}
		}
		var menuItem = new cc.MenuItemImage(res.Back_png, res.Back_clicked_png, goToMenu);
		var menu = new cc.Menu(menuItem);
		menu.alignItemsVerticallyWithPadding(50);
		menu.setPosition(new cc.p(size.width/2,size.height/2-170))
		this.addChild(menu);
		return true;
	},
});

var ScoreScene = cc.Scene.extend({
	onEnter:function () {
		this._super();
		var layer5 = new ScoreLayer();
		this.addChild(layer5);
	}
});