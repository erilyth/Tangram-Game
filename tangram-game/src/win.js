var WinLayer = cc.Layer.extend({
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
		/*r sprite = new cc.Sprite.create(res.Board_png);
		sprite.setAnchorPoint(new new cc.p(0.5,0.5));*/
		var sprite = new cc.Sprite.create(res.Youwin_png);
		sprite.setAnchorPoint(new cc.p(0.5,0.5));
		sprite.setPosition(new cc.p(size.width/2,size.height/2));
		sprite.setScaleX(0.5);
		sprite.setScaleY(0.5);
		this.addChild(sprite);
		textField = new ccui.TextField();
		textField.setTouchEnabled(true);
		textField.fontName = "Marker Felt";
		textField.placeHolder = "Enter your name here";
		textField.fontSize = 30;
		textField.x = size.width/2;
		textField.y = size.height/2+100;
		textField.addEventListener(this.textFieldEvent, this);
		var label = new cc.LabelTTF(30-levelScore, "Lobster", 28);
		label.setPosition(new cc.p(size.width/2,size.height/2-70));
		this.addChild(label);
		this.addChild(textField);
		return true;
	},

	textFieldEvent: function(sender, type){
		switch (type)
		{
		case ccui.TextField.EVENT_ATTACH_WITH_IME:
			cc.log("Activate");

			break;
		case ccui.TextField.EVENT_DETACH_WITH_IME:
			cc.log("DeActivate");
			var ls = cc.sys.localStorage;
			var cur = textField.string;
			if (ls.getItem("#playerNames") == null){
				var list1 = new Array(100);
				var list2 = new Array(100);
				ls.setItem("#playerNames",JSON.stringify(list1));
				ls.setItem("#playerScores",JSON.stringify(list2));
			}
			var state=0;
			var playerNamesList=JSON.parse(ls.getItem("#playerNames"));
			var playerScoresList=JSON.parse(ls.getItem("#playerScores"));
			for(i=0;i<playerNamesList.length;i++){
				if(playerNamesList[i]==cur || playerNamesList[i]==null){
					state=1;
					playerNamesList[i]=cur;
					cc.log(playerNamesList[i]);
					if(playerScoresList[i]<30-levelScore){
						playerScoresList[i]=30-levelScore;
					}
					break;
				}
			}
			//cc.log(cur);
			ls.setItem("#playerNames",JSON.stringify(playerNamesList));
			ls.setItem("#playerScores",JSON.stringify(playerScoresList));
			var addedState=0;
			if(currentLevel==modeLevels[currentMode-1]){
				if (ls.getItem("#Achievements") == null) {
					cc.log("Clearing");
					var list = new Array(100);
					var names = new Array(100);
					for(i=0;i<100;i++){
						list[i] = new Array(100);
					}
					ls.setItem("#Names",JSON.stringify(names));
					ls.setItem("#Achievements",JSON.stringify(list));
				}
				var list=JSON.parse(ls.getItem("#Achievements"));
				var names=JSON.parse(ls.getItem("#Names"));
				for(i=0;i<list.length && addedState==0;i++){
					if(names[i]==null || names[i]==textField.string){
						names[i]=textField.string;
						for(j=0;j<list[i].length;j++){
							if(list[i][j]==null || list[i][j]=="Completed Mode "+currentMode.toString()){
								list[i][j]="Completed Mode "+currentMode.toString();
								addedState=1;
								break;
							}
						}
					}
				}
				ls.setItem("#Names",JSON.stringify(names));
				ls.setItem("#Achievements",JSON.stringify(list));
			}
			cc.director.runScene(new MenuScene());

			break;
		case ccui.TextField.EVENT_INSERT_TEXT:
			cc.log("Inserted");
			cc.log(textField.string);

			break;
		case ccui.TextField.EVENT_DELETE_BACKWARD:
			cc.log("Delete");
			cc.log(textField.string);

			break;
		}
	}
});

var WinScene = cc.Scene.extend({
	onEnter:function () {
		this._super();
		var layer2 = new WinLayer();
		this.addChild(layer2);
	}
});