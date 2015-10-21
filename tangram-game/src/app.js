//BlockWidth is 20 and in other places its directly coded as 20.
//Board currently has 15 rows and 15 columns where the victory area is a 4x3 rectangle.
//There are 2 pieces currently.

var Piece= cc.Class.extend({
	color:"blue",
	blockWidth:20,
	basePositionX:0,
	basePositionY:0,
	pieceNumber:0,
	ctor:function(x,y,pieceNo){
		this.basePositionX=x;
		this.basePositionY=y;
		this.pieceNumber=pieceNo;
		// Custom initialization
	},
	positionarr:[],
	spriteBlocks:[],
	initpositionarr:function(posarr){
		this.positionarr=new Array(3)
		this.spriteBlocks=new Array(3)
		for(i=0;i<3;i++){
			this.spriteBlocks[i]= new Array(3);
			this.positionarr[i]=new Array(3);
			for(j=0;j<3;j++){
				if(posarr[i][j]==1){
					this.spriteBlocks[i][j]=  new cc.Sprite.create(res.HelloWorld_png);
					this.positionarr[i][j]=1;
					this.spriteBlocks[i][j].setPosition(new cc.Point(this.blockWidth*(i+this.basePositionY),this.blockWidth*(j+this.basePositionX)));
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
		for(i=0;i<3;i++){
			for(j=0;j<3;j++){
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
			for(i=0;i<3;i++){
				for(j=0;j<3;j++){
					if(this.positionarr[i][j]==1){
						boardObj.positionarr[i+this.basePositionX][j+this.basePositionY]=-1;
					}
				}
			}
			this.basePositionX=a;
			this.basePositionY=b;
			for(i=0;i<3;i++){
				for(j=0;j<3;j++){
					if(this.positionarr[i][j]==1){
						var actionMove = cc.MoveTo.create(0.3, cc.p(this.blockWidth*(i+this.basePositionX),this.blockWidth*(j+this.basePositionY)));
						this.spriteBlocks[i][j].runAction(actionMove);
						boardObj.positionarr[i+this.basePositionX][j+this.basePositionY]=this.pieceNumber;
					}
				}
			}
		}
		for(i=0;i<15;i++){
			cc.log(boardObj.positionarr[i]);
		}
	}
});

var Board = cc.Class.extend({
	positionarr:[],
	spriteBlocks:[],
	ctor:function(){
		this.initpositionarr();
		// Custom initialization
	},
	initpositionarr:function(){
		this.positionarr=new Array(15)
		this.spriteBlocks=new Array(15)
		for(i=0;i<15;i++){
			this.spriteBlocks[i]= new Array(15);
			this.positionarr[i]=new Array(15);
			for(j=0;j<15;j++){
				if(i>=4 && i<8 && j>=4 && j<7){
					this.spriteBlocks[i][j]= new cc.Sprite.create(res.PlaceBoard_png);
				}
				else{
					this.spriteBlocks[i][j]=  new cc.Sprite.create(res.Board_png);
				}
				this.positionarr[i][j]=-1;
				this.spriteBlocks[i][j].setPosition(new cc.p(20*i,20*j));
				this.spriteBlocks[i][j].setScale(20/this.spriteBlocks[i][j].getContentSize().width,20/this.spriteBlocks[i][j].getContentSize().height);
				this.spriteBlocks[i][j].setAnchorPoint(new cc.p(0,0));
			}
		}
	},
	checkVictory:function(){
		for(i=4;i<8;i++){
			for(j=4;j<7;j++){
				if(this.positionarr[i][j]==-1){
					return 0;
				}
			}
		}
		return 1;
	}
//add your properties and functions
});

var GameMode1Layer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        
        
        //(0,0) is the bottom left point.
        var board = new Board();
        //var board = new BoardSprite(res.CloseSelected_png,cc.rect(300,300,200,200));
        var pieceList = new Array(5);
        var noOfPieces=2;
        var piece = new Piece(1,0,0);
        var piece2 = new Piece(10,5,1);
        //var piece3 = new Piece(7,1,2);
        var arr=new Array(3);
        var arr2=new Array(3);
        for(i=0;i<3;i++){
        	arr[i]=new Array(3);
        	arr2[i]=new Array(3);
        	for(j=0;j<3;j++){
        		arr2[i][j]=1;
        	}
        }
        arr[0][0]=1;
        arr[0][1]=1;
        arr[0][2]=1;
        piece.initpositionarr(arr);
        piece2.initpositionarr(arr2);
        pieceList[0]=piece;
        pieceList[1]=piece2;
        for(i=0;i<15;i++){
        	for(j=0;j<15;j++){
        		this.addChild(board.spriteBlocks[i][j]);
        	}
        }
        for(i=0;i<3;i++){
        	for(j=0;j<3;j++){
        		for(k=0;k<noOfPieces;k++){
	        		if(pieceList[k].positionarr[i][j]==1){
	        			this.addChild(pieceList[k].spriteBlocks[i][j]);
	        		}
        		}
        	}
        }
        for(k=0;k<noOfPieces;k++){
        	pieceList[k].placePiece(pieceList[k].basePositionX,pieceList[k].basePositionY,board);
        }
        //var actionmove = cc.MoveTo.create(1, cc.p(300,300));
        //piece.spriteBlocks[0][0].runAction(actionmove);
        //piece.placePiece(1,4,board);
        //piece2.placePiece(6,7,board);
        
        var clickOffsetXBlock=0;
        var clickOffsetYBlock=0;
        var originalBaseX=0;
        var originalBaseY=0;
        var pieceSelected=-1;
        
        if (cc.sys.capabilities.hasOwnProperty('mouse')){ //Set up mouse events
        	cc.eventManager.addListener(
        			{
        				event: cc.EventListener.MOUSE,
        				onMouseDown:function(event){
        					if (event.getButton() == cc.EventMouse.BUTTON_LEFT){
        						for(k=0;k<noOfPieces;k++){
	        						//cc.log(event.getLocationX());
        							if(pieceSelected==-1){
        								clickOffsetXBlock=0;
        								clickOffsetYBlock=0;
        							}
	        						var click=cc.p(event.getLocationX(),event.getLocationY());
	        						var x=Math.floor((event.getLocationX())/20);
	        						var y=Math.floor((event.getLocationY())/20);
	        						//cc.log(x + " " + y + " Clicked at")
	        						for(i=0;i<3;i++){
	        							for(j=0;j<3;j++){
	        								if(pieceList[k].positionarr[i][j]==1 && cc.rectContainsPoint(new cc.Rect((pieceList[k].basePositionX+i)*20,(pieceList[k].basePositionY+j)*20,20,20),click)){
	        									originalBaseX=pieceList[k].basePositionX;
	        									originalBaseY=pieceList[k].basePositionY;
	        									pieceSelected=k;
	        									clickOffsetXBlock=i;
	        									clickOffsetYBlock=j;
	        								}
	        							}
	        						}
	        						//cc.log("Left mouse clicked at "+event.getLocationX());
	        					}
        					}
        				},
        				onMouseMove: function (event) {         
        					//Move the position of current button sprite
        					if(pieceSelected!=-1){
        						for(i=0;i<3;i++){
        							for(j=0;j<3;j++){
        								if(pieceList[pieceSelected].positionarr[i][j]==1){
        									var target=pieceList[pieceSelected].spriteBlocks[i][j].getPosition();
        									var delta = event.getDelta();
        									target.x += delta.x;
        									target.y += delta.y;
        									pieceList[pieceSelected].spriteBlocks[i][j].setPosition(target);
        								}
        							}
        						}
        					}
        				},
        				onMouseUp:function(event){
        					if (event.getButton() == cc.EventMouse.BUTTON_LEFT){
        						if(pieceSelected!=-1){
	        						var click2=cc.p(event.getLocationX(),event.getLocationY());
	        						var x=Math.floor((event.getLocationX())/20);
	        						var y=Math.floor((event.getLocationY())/20);
	        						cc.log((x-clickOffsetXBlock) + " " + (y-clickOffsetYBlock) + " Left at")
	        						if(pieceList[pieceSelected].checkPiece(x-clickOffsetXBlock, y-clickOffsetYBlock, board)==1){
	        							pieceList[pieceSelected].placePiece(x-clickOffsetXBlock,y-clickOffsetYBlock,board);
	        						}
	        						else{
	        							pieceList[pieceSelected].placePiece(originalBaseX,originalBaseY,board);
	        						}
	        						pieceSelected=-1;
        						}
        						if(board.checkVictory()==1){
        							cc.log("YOU WIN!");
        						}
        						//cc.log("Left mouse released at "+event.getLocationX());
        					}
        				}

        			}, this);
        }
        
        return true;
    }
});

var MenuLayer = cc.Layer.extend({
	ctor:function () {
		//////////////////////////////
		// 1. super init first
		this._super();
		var size = cc.winSize;
		var sprite = new cc.Sprite.create(res.Board_png);
		sprite.setAnchorPoint(cc.p(0.5,0.5));
		sprite.setPosition(cc.p(size.width/2,size.height/2));
		sprite.setScaleX(0.5);
		sprite.setScaleY(0.2);
		var menuItem1 = new cc.MenuItemFont("Play Mode 1",startGame);
		var menuItem2 = new cc.MenuItemFont("Quit", quitGame);
		var menu = new cc.Menu(menuItem1,menuItem2);
		menu.alignItemsVerticallyWithPadding(50);
		this.addChild(menu);
		return true;
	},
	buttoner:function(){
		return this.buttonclicked;
	}
});

var quitGame=function(){
	cc.log("Exit game");
}

var startGame=function(){
	cc.director.runScene(new GameMode1Scene());
}

var MenuScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer2 = new MenuLayer();
        this.addChild(layer2);
       
    }
});


var GameMode1Scene = cc.Scene.extend({
	onEnter:function () {
		this._super();
		var layer = new GameMode1Layer();
		this.addChild(layer);
	}
});

