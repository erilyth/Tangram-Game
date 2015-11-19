var AchievementLayer = cc.Layer.extend({
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
		var list = new Array(100);
		var names = new Array(100);
		for(i=0;i<100;i++){
			list[i] = new Array(100);
		}
		//If you want to reset the achievements and names, remove the if statement below and view the achievements page.
		if(ls.getItem("#Achievements")==null || ls.getItem("#Names")==null){
			var names = new Array(100);
			for(i=0;i<100;i++){
				list[i] = new Array(100);
			}
			ls.setItem("#Names",JSON.stringify(names)); //We use JSON to store arrays as strings.
			ls.setItem("#Achievements",JSON.stringify(list)); //We use JSON to store arrays as strings.
		}
		names=JSON.parse(ls.getItem("#Names"));
		list=JSON.parse(ls.getItem("#Achievements"));
		cc.log(list);
		var temp;
		var state=0;
		for(temp=0;temp<list.length;temp++){
			state=0;
			for(temp2=0;temp2<list[temp].length;temp2++){
				if(list[temp][temp2]!=null){
					if(state==0){
						var label = new cc.LabelTTF(names[temp],"Arial");
						label.setFontSize(15);
						label.setPosition(new cc.p(size.width/2-150,size.height/2-50+temp*20));
						this.addChild(label);
						state=1;
					}
					var label2 = new cc.LabelTTF(list[temp][temp2],"Arial");
					label2.setFontSize(10);
					label2.setPosition(new cc.p(size.width/2-150+(temp2+1)*100,size.height/2-50+temp*20));
					this.addChild(label2);
				}
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


var AchievementScene = cc.Scene.extend({
	onEnter:function () {
		this._super();
		var layer6 = new AchievementLayer();
		this.addChild(layer6);
	}
});