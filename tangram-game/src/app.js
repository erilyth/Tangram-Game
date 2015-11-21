//BlockWidth is 20 and in other places its directly coded as 20.
//Board currently has 15 rows and 15 columns where the victory area is a 4x3 rectangle.

var totalOffsetX=0;
var totalOffsetY=0;
var levelScore=0;
var modeLevels = [1,1,1];
var currentMode=0;
var currentLevel=0;

var creationGameMode=-1; //Do not modify this.
var creationLevel=-1; //Do not modify this

var Piece= cc.Class.extend({
	color:"blue",
	blockWidth:20,
	basePositionX:0,
	basePositionY:0,
	madeUpCount:0,
	pieceNumber:0,
	ctor:function(x,y,pieceNo){
		this.basePositionX=x;
		this.basePositionY=y;
		this.pieceNumber=pieceNo;
		// Custom initialization
	},
	positionarr:[],
	rotatedarr:[],
	oldarr:[],
	spriteBlocks:[],
	initpositionarr:function(posarr){
		this.positionarr=new Array(posarr.length);
		this.oldarr=new Array(posarr.length);
		this.rotatedarr=new Array(posarr.length);
		this.spriteBlocks=new Array(posarr.length);
		cc.log("HERE");
		cc.log(this.pieceNumber);
		var imageStyle = this.pieceNumber;
		for(i=0;i<posarr.length;i++){
			this.oldarr[i]=new Array(posarr.length);
			this.spriteBlocks[i]= new Array(posarr.length);
			this.rotatedarr[i]=new Array(posarr.length);
			this.positionarr[i]=new Array(posarr.length);
			for(j=0;j<posarr.length;j++){
				if(posarr[i][j]==1){
					this.madeUpCount+=1;
					if(imageStyle == 0)
						this.spriteBlocks[i][j]=  new cc.Sprite.create(res.Piece1_png);
					if(imageStyle == 1)
						this.spriteBlocks[i][j]=  new cc.Sprite.create(res.Piece2_png);
					if(imageStyle == 2)
						this.spriteBlocks[i][j]=  new cc.Sprite.create(res.Piece3_png);
					if(imageStyle == 3)
						this.spriteBlocks[i][j]=  new cc.Sprite.create(res.Piece4_png);


					this.positionarr[i][j]=1;
					this.spriteBlocks[i][j].setPosition(new cc.p(totalOffsetX+this.blockWidth*(i+this.basePositionX),totalOffsetY+this.blockWidth*(j+this.basePositionY)));
					this.spriteBlocks[i][j].setScale(20/this.spriteBlocks[i][j].getContentSize().width,20/this.spriteBlocks[i][j].getContentSize().height);	
					this.spriteBlocks[i][j].setAnchorPoint(new cc.p(0,0));
				}
				else
					this.positionarr[i][j]=0;
			}
		}
	},
	getpositionX:function(){
		return this.basePositionX;
	},
	getpositionY:function(){
		return this.basePositionY;
	},
	checkPiece:function(a,b,boardObj){ //a=x and b=y coordinates so arr[a][b] would be how we check
		//x axis is rows and y axis is columns.

		//Rows are vertical 
		//Columns are horizontal

		//cc.log(a);
		//cc.log(b);
		var state=0;
		for(i=0;i<this.positionarr.length;i++){
			for(j=0;j<this.positionarr[i].length;j++){
				if(i+a<0)
					state=1;
				else if(i+a>=15)
					state=1;
				else if(j+b<0)
					state=1;
				else if(j+b>=15)
					state=1;
				else if(boardObj.positionarr[i+a][j+b]!=-1 && boardObj.positionarr[i+a][j+b]!=this.pieceNumber && this.positionarr[i][j]==1){
					state=1;
					cc.log("FAILED to PLACE");
				}
			}
		}
		if(state==0){
			cc.log("SUCCESS");
			return 1;
		}
		else
			return 0;
	},
	placePiece:function(a,b,boardObj){
		if(this.checkPiece(a,b,boardObj)==1){
			for(i=0;i<this.positionarr.length;i++){
				for(j=0;j<this.positionarr[i].length;j++){
					if(this.positionarr[i][j]==1){
						boardObj.positionarr[i+this.basePositionX][j+this.basePositionY]=-1;
					}
				}
			}
			this.basePositionX=a;
			this.basePositionY=b;
			for(i=0;i<this.positionarr.length;i++){
				for(j=0;j<this.positionarr[i].length;j++){
					if(this.positionarr[i][j]==1){
						var actionMove = cc.MoveTo.create(0, new cc.p(totalOffsetX+this.blockWidth*(i+this.basePositionX),totalOffsetY+this.blockWidth*(j+this.basePositionY)));
						this.spriteBlocks[i][j].runAction(actionMove);
						boardObj.positionarr[i+this.basePositionX][j+this.basePositionY]=this.pieceNumber;
					}
				}
			}
		}
		//for(i=0;i<15;i++){
		//	cc.log(boardObj.positionarr[i]);
		//}
	},
	rotatePiece:function(dir,boardObj){
		for(i=0;i<this.positionarr.length;i++){
			for(j=0;j<this.positionarr[i].length;j++){
				this.oldarr[i][j]=this.positionarr[i][j];
				cc.log(this.positionarr[i].length-j);
				this.rotatedarr[i][j]=this.positionarr[this.positionarr[i].length-1-j][i];
			}
		}
		for(i=0;i<this.positionarr.length;i++){
			for(j=0;j<this.positionarr[i].length;j++){
				this.positionarr[i][j]=this.rotatedarr[i][j];
			}
		}
		if(this.checkPiece(this.basePositionX,this.basePositionY,boardObj)==1){
			for(i=0;i<this.positionarr.length;i++){
				for(j=0;j<this.positionarr[i].length;j++){
					if(this.oldarr[i][j]==1){
						boardObj.positionarr[i+this.basePositionX][j+this.basePositionY]=-1;
					}
				}
			}
			for(i=0;i<this.positionarr.length;i++){
				for(j=0;j<this.positionarr[i].length;j++){
					if(this.positionarr[i][j]==1){
						boardObj.positionarr[i+this.basePositionX][j+this.basePositionY]=this.pieceNumber;
					}
				}
			}
		}
		else{
			for(i=0;i<this.positionarr.length;i++){
				for(j=0;j<this.positionarr[i].length;j++){
					this.positionarr[i][j]=this.oldarr[i][j];
				}
			}
		}
		for(i=0;i<this.positionarr.length;i++){
			for(j=0;j<this.positionarr[i].length;j++){
				if(this.positionarr[i][j]==1){
					if(this.pieceNumber==0)
						this.spriteBlocks[i][j]=  new cc.Sprite.create(res.Piece1_png);
					if(this.pieceNumber==1)
						this.spriteBlocks[i][j]=  new cc.Sprite.create(res.Piece2_png);
					if(this.pieceNumber==2)
						this.spriteBlocks[i][j]=  new cc.Sprite.create(res.Piece3_png);
					if(this.pieceNumber==3)
						this.spriteBlocks[i][j]=  new cc.Sprite.create(res.Piece4_png);
					this.spriteBlocks[i][j].setPosition(new cc.Point(totalOffsetX+this.blockWidth*(i+this.basePositionX),totalOffsetY+this.blockWidth*(j+this.basePositionY)));
					this.spriteBlocks[i][j].setScale(20/this.spriteBlocks[i][j].getContentSize().width,20/this.spriteBlocks[i][j].getContentSize().height);	
					this.spriteBlocks[i][j].setAnchorPoint(new cc.p(0,0));
				}
			}
		}
	}
});

var Board = cc.Class.extend({
	positionarr:[],
	spriteBlocks:[],
	belongPieces:[],
	countArray:[],
	victoryArray:[],
	ctor:function(victoryposition){
		this.initpositionarr(victoryposition);
		// Custom initialization
	},
	initpositionarr:function(victoryposition){
		this.positionarr=new Array(15);
		this.spriteBlocks=new Array(15);
		this.belongPieces=new Array(15);
		this.countArray=new Array(15);
		for(i=0;i<15;i++){
			this.spriteBlocks[i]= new Array(15);
			this.positionarr[i]=new Array(15);
			this.victoryArray[i]=new Array(15);
			for(j=0;j<15;j++){
				if(victoryposition[i][j]==1){
					this.victoryArray[i][j]=1;
					this.spriteBlocks[i][j]= new cc.Sprite.create(res.PlaceBoard_png);
					this.spriteBlocks[i][j].setPosition(new cc.p(totalOffsetX+20*i,totalOffsetY+20*j));
					this.spriteBlocks[i][j].setScale(20/this.spriteBlocks[i][j].getContentSize().width,20/this.spriteBlocks[i][j].getContentSize().height);
					this.spriteBlocks[i][j].setAnchorPoint(new cc.p(0,0));
				}
				else{
					this.victoryArray[i][j]=0;
					//this.spriteBlocks[i][j]= new cc.Sprite.create(res.Board_png);
				}
				this.positionarr[i][j]=-1;
				
			}
		}
	},
	checkVictory:function(){
		for(i=0;i<15;i++){
			this.countArray[i]=0;
		}
		for(i=0;i<15;i++){
			for(j=0;j<15;j++){
				if(this.victoryArray[i][j]==1){
					if(this.positionarr[i][j]==-1){
						return 0;
					}
					this.countArray[this.positionarr[i][j]]+=1;
				}
			}
		}
		for(i=0;i<15;i++){
			if(this.countArray[i]!=0){
				if(this.countArray[i]!=this.belongPieces[i].madeUpCount){
					return 0;
				}
			}
		}
		return 1;
	}
//	add your properties and functions
});

var MenuLayer = cc.Layer.extend({
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
		var menuItem1 = new cc.MenuItemImage(res.Play_m1_png, res.Play_m1_clicked_png, startGameMode1);
		var menuItem2 = new cc.MenuItemImage(res.Play_m2_png, res.Play_m2_clicked_png, startGameMode2);
		var menuItem3 = new cc.MenuItemImage(res.Play_m3_png, res.Play_m3_clicked_png, startGameMode3);
		var menuItem4 = new cc.MenuItemImage(res.ViewScores_png, res.ViewScores_clicked_png, viewScores);
		var menuItem5 = new cc.MenuItemImage(res.ViewAchievements_png, res.ViewAchievements_clicked_png, viewAchievements);
		var menuItem6 = new cc.MenuItemImage(res.Quit_png, res.Quit_clicked_png, quitGame);
		var menu = new cc.Menu(menuItem1,menuItem2,menuItem3,menuItem4,menuItem5,menuItem6);
		menu.alignItemsVerticallyWithPadding(20);
		this.addChild(menu);
		return true;
	}
});

var MenuScene = cc.Scene.extend({
	onEnter:function () {
		this._super();
		var layer = new MenuLayer();
		this.addChild(layer);
	}
});

var viewScores=function(){
	cc.director.runScene(new ScoreScene());
}

var viewAchievements=function(){
	cc.director.runScene(new AchievementScene());
}

var quitGame=function(){
	cc.log("Exit game");
}

var startGameMode1=function(){
	creationGameMode=1;
	cc.director.runScene(new LevelScene());
}

var startGameMode2=function(){
	creationGameMode=2;
	cc.director.runScene(new LevelScene());
}

var startGameMode3=function(){
	creationGameMode=3;
	cc.director.runScene(new LevelScene());
}

var goToMenu=function(){
	cc.director.runScene(new MenuScene());
}