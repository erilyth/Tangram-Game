var LevelLayer = cc.Layer.extend({
	ctor:function (gameMode) {
		//////////////////////////////
		// 1. super init first
		this._super();
		cc.log(gameMode);
		var size = cc.winSize;
		var background = new cc.Sprite.create(res.Background_png);
		background.setPosition(new cc.p(0,0));
		background.setScale(size.width/background.getContentSize().width, size.height/background.getContentSize().height);
		background.setAnchorPoint(new cc.p(0,0));
		this.addChild(background);
		var menuItems = new Array(modeLevels[gameMode-1]);
		for(i=0;i<modeLevels[gameMode-1];i++){
			j=i+1;
			menuItems[i] = new cc.MenuItemImage(res.Level_png, res.Level_clicked_png,
//					menuItems[i] = new cc.MenuItemFont("Level "+j.toString(), // level number maker
					function() {  
				if(gameMode==1){
					if(j==1)
						cc.director.runScene(new GameMode1Scene1());
				}
				if(gameMode==2){
					if(j==1)
						cc.director.runScene(new GameMode2Scene1());
				}
				if(gameMode==3){
					if(j==1)
						cc.director.runScene(new GameMode3Scene1());
				}  
			}
			);
		}
		var menu = new cc.Menu(menuItems[0]);
		//menu.initWithItems(menuItems);
		menu.alignItemsVerticallyWithPadding(50);
		this.addChild(menu);
		return true;
	}
});

var LevelScene = cc.Scene.extend({
	onEnter:function () {
		this._super();
		var layer6 = new LevelLayer(creationGameMode);
		this.addChild(layer6);
	}
});