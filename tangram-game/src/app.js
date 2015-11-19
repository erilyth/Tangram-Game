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

var GameMode1Layer = cc.Layer.extend({
	sprite:null,
	ctor:function (board,pieceList,noOfPieces) {
		//////////////////////////////
		// 1. super init first
		this._super();
		var size=cc.winSize;
		currentMode=1;
		levelScore=0;
		/////////////////////////////
		// 2. add a menu item with "X" image, which is clicked to quit the program
		//    you may modify it.
		// ask the window size
		var background = new cc.Sprite.create(res.GameBackground_png);
		background.setPosition(new cc.p(0,0));
		background.setScale(size.width/background.getContentSize().width, size.height/background.getContentSize().height);
		background.setAnchorPoint(new cc.p(0,0));
		this.addChild(background);

		//(0,0) is the bottom left point.
		for(i=0;i<15;i++){
			for(j=0;j<15;j++){
				if(board.spriteBlocks[i][j])
					this.addChild(board.spriteBlocks[i][j]);
			}
		}
		
		var sizex=pieceList[0].positionarr.length;
		var sizey=pieceList[0].positionarr[0].length;
		for(i=0;i<sizex;i++){
			for(j=0;j<sizey;j++){
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
		var recentPiece=0;
		var clickOffsetXBlock=0;
		var clickOffsetYBlock=0;
		var originalBaseX=0;
		var originalBaseY=0;
		var pieceSelected=-1;
		var reference=this;
		
		if (cc.sys.capabilities.hasOwnProperty('keyboard')){
			cc.eventManager.addListener(
					{
						event: cc.EventListener.KEYBOARD,
						onKeyPressed:function(key,event){
							if(key==68){
								levelScore+=1;
								for(i=0;i<4;i++){
									for(j=0;j<4;j++){
										if(pieceList[recentPiece].positionarr[i][j]==1){
											reference.removeChild(pieceList[recentPiece].spriteBlocks[i][j]);
										}
									}
								}
								pieceList[recentPiece].rotatePiece(0,board);
								for(i=0;i<4;i++){
									for(j=0;j<4;j++){
										if(pieceList[recentPiece].positionarr[i][j]==1){
											reference.addChild(pieceList[recentPiece].spriteBlocks[i][j]);
										}
									}
								}
							}
							if(board.checkVictory()==1){
								cc.log("YOU WIN!");
								cc.director.runScene(new WinScene());
							}
						}
					},this);
		}
		
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
									var x=Math.floor((event.getLocationX()-totalOffsetX)/20);
									var y=Math.floor((event.getLocationY()-totalOffsetY)/20);
									cc.log(x + " " + y + " Clicked at")
									for(i=0;i<4;i++){
										for(j=0;j<4;j++){
											if(pieceList[k].positionarr[i][j]==1 && cc.rectContainsPoint(new cc.Rect(totalOffsetX+(pieceList[k].basePositionX+i)*20,totalOffsetY+(pieceList[k].basePositionY+j)*20,20,20),click)){
												originalBaseX=pieceList[k].basePositionX;
												originalBaseY=pieceList[k].basePositionY;
												pieceSelected=k;
												recentPiece=k;
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
								for(i=0;i<4;i++){
									for(j=0;j<4;j++){
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
									var x=Math.floor((event.getLocationX()-totalOffsetX)/20);
									var y=Math.floor((event.getLocationY()-totalOffsetY)/20);
									cc.log(x+" "+y);
									cc.log((x-clickOffsetXBlock) + " " + (y-clickOffsetYBlock) + " Left at")
									if(pieceList[pieceSelected].checkPiece(x-clickOffsetXBlock,y-clickOffsetYBlock,board)==1){
										pieceList[pieceSelected].placePiece(x-clickOffsetXBlock,y-clickOffsetYBlock,board);
										levelScore+=1;
									}
									else{
										pieceList[pieceSelected].placePiece(originalBaseX,originalBaseY,board);
									}
									pieceSelected=-1;
								}
								if(board.checkVictory()==1){
									cc.log("YOU WIN!");
									cc.director.runScene(new WinScene());
								}
								//cc.log("Left mouse released at "+event.getLocationX());
							}
						}

					}, this);
		}
		
		if (cc.sys.capabilities.hasOwnProperty('touches')){ //Set up mouse events
			cc.eventManager.addListener(
					{
						event: cc.EventListener.TOUCH_ONE_BY_ONE,
						onTouchBegan:function(touch, event){
			//				if (event.getButton() == cc.EventMouse.BUTTON_LEFT){
								for(k=0;k<noOfPieces;k++){
									//cc.log(touch.getLocationX());
									if(pieceSelected==-1){
										clickOffsetXBlock=0;
										clickOffsetYBlock=0;
									}
									var click=new cc.p(touch.getLocationX(),touch.getLocationY());
									var x=Math.floor((touch.getLocationX()-totalOffsetX)/20);
									var y=Math.floor((touch.getLocationY()-totalOffsetY)/20);
									cc.log(x + " " + y + " Clicked at")
									for(i=0;i<4;i++){
										for(j=0;j<4;j++){
											if(pieceList[k].positionarr[i][j]==1 && cc.rectContainsPoint(new cc.rect(totalOffsetX+(pieceList[k].basePositionX+i)*20,totalOffsetY+(pieceList[k].basePositionY+j)*20,20,20),click)){
												originalBaseX=pieceList[k].basePositionX;
												originalBaseY=pieceList[k].basePositionY;
												pieceSelected=k;
												recentPiece=k;
												clickOffsetXBlock=i;
												clickOffsetYBlock=j;
											}
										}
									}
									//cc.log("Left mouse clicked at "+touch.getLocationX());
								}
					//		}
								return true;
						},
						onTouchMoved: function (touch, event) {         
							//Move the position of current button sprite
							if(pieceSelected!=-1){
								for(i=0;i<4;i++){
									for(j=0;j<4;j++){
										if(pieceList[pieceSelected].positionarr[i][j]==1){
											var target=pieceList[pieceSelected].spriteBlocks[i][j].getPosition();
											var delta = touch.getDelta();
											target.x += delta.x;
											target.y += delta.y;
											pieceList[pieceSelected].spriteBlocks[i][j].setPosition(target);
										}
									}
								}
							}
						},
						onTouchEnded:function(touch, event){
		//					if (event.getButton() == cc.EventMouse.BUTTON_LEFT){
								if(pieceSelected!=-1){
									var x=Math.floor((touch.getLocationX()-totalOffsetX)/20);
									var y=Math.floor((touch.getLocationY()-totalOffsetY)/20);
									cc.log(x+" "+y);
									cc.log((x-clickOffsetXBlock) + " " + (y-clickOffsetYBlock) + " Left at")
									if(pieceList[pieceSelected].checkPiece(x-clickOffsetXBlock,y-clickOffsetYBlock,board)==1){
										pieceList[pieceSelected].placePiece(x-clickOffsetXBlock,y-clickOffsetYBlock,board);
										levelScore+=1;
									}
									else{
										pieceList[pieceSelected].placePiece(originalBaseX,originalBaseY,board);
									}
									pieceSelected=-1;
								}
								if(board.checkVictory()==1){
									cc.log("YOU WIN!");
									cc.director.runScene(new WinScene());
								}
								//cc.log("Left mouse released at "+touch.getLocationX());
			//				}
								return true;
						}

					}, this);
		}
		var menuItem = new cc.MenuItemImage(res.Back_png, res.Back_clicked_png, goToMenu);
		var menu = new cc.Menu(menuItem);
		menu.alignItemsVerticallyWithPadding(50);
		menu.setPosition(new cc.p(size.width/2,size.height/2-180))
		this.addChild(menu);
		return true;
	}
});

var GameMode2Layer = cc.Layer.extend({
	sprite:null,
	ctor:function (board,pieceList,noOfPieces) {
		//////////////////////////////
		// 1. super init first
		this._super();
		var size=cc.winSize;
		currentMode=2;
		levelScore=0;
		var background = new cc.Sprite.create(res.GameBackground_png);
		background.setPosition(new cc.p(0,0));
		background.setScale(size.width/background.getContentSize().width, size.height/background.getContentSize().height);
		background.setAnchorPoint(new cc.p(0,0));
		this.addChild(background);
		for(i=0;i<15;i++){
			for(j=0;j<15;j++){
				if(board.spriteBlocks[i][j])
					this.addChild(board.spriteBlocks[i][j]);
			}
		}
		var sizex=pieceList[0].positionarr.length;
		var sizey=pieceList[0].positionarr[0].length;
		for(i=0;i<sizex;i++){
			for(j=0;j<sizey;j++){
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
		//var actionmove = cc.MoveTo.create(1, new cc.p(300,300));
		//piece.spriteBlocks[0][0].runAction(actionmove);
		//piece.placePiece(1,4,board);
		//piece2.placePiece(6,7,board);

		var recentPiece=0;
		var clickOffsetXBlock=0;
		var clickOffsetYBlock=0;
		var originalBaseX=0;
		var originalBaseY=0;
		var pieceSelected=-1;
		var reference=this;

		if (cc.sys.capabilities.hasOwnProperty('keyboard')){
			cc.eventManager.addListener(
					{
						event: cc.EventListener.KEYBOARD,
						onKeyPressed:function(key,event){
							if(key==68){
								levelScore+=1;
								for(i=0;i<3;i++){
									for(j=0;j<3;j++){
										if(pieceList[recentPiece].positionarr[i][j]==1){
											reference.removeChild(pieceList[recentPiece].spriteBlocks[i][j]);
										}
									}
								}
								pieceList[recentPiece].rotatePiece(0,board);
								for(i=0;i<3;i++){
									for(j=0;j<3;j++){
										if(pieceList[recentPiece].positionarr[i][j]==1){
											reference.addChild(pieceList[recentPiece].spriteBlocks[i][j]);
										}
									}
								}
							}
							if(board.checkVictory()==1){
								cc.log("YOU WIN!");
								cc.director.runScene(new WinScene());
							}
						}
					},this);
		}
		
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
									var x=Math.floor((event.getLocationX()-totalOffsetX)/20);
									var y=Math.floor((event.getLocationY()-totalOffsetY)/20);
									cc.log(x + " " + y + " Clicked at")
									for(i=0;i<3;i++){
										for(j=0;j<3;j++){
											if(pieceList[k].positionarr[i][j]==1 && cc.rectContainsPoint(new cc.Rect(totalOffsetX+(pieceList[k].basePositionX+i)*20,totalOffsetY+(pieceList[k].basePositionY+j)*20,20,20),click)){
												originalBaseX=pieceList[k].basePositionX;
												originalBaseY=pieceList[k].basePositionY;
												pieceSelected=k;
												recentPiece=k;
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
									var x=Math.floor((event.getLocationX()-totalOffsetX)/20);
									var y=Math.floor((event.getLocationY()-totalOffsetY)/20);
									cc.log(x+" "+y);
									cc.log((x-clickOffsetXBlock) + " " + (y-clickOffsetYBlock) + " Left at")
									if(pieceList[pieceSelected].checkPiece(x-clickOffsetXBlock,y-clickOffsetYBlock,board)==1){
										pieceList[pieceSelected].placePiece(x-clickOffsetXBlock,y-clickOffsetYBlock,board);
										levelScore+=1;
									}
									else{
										pieceList[pieceSelected].placePiece(originalBaseX,originalBaseY,board);
									}
									pieceSelected=-1;
								}
								if(board.checkVictory()==1){
									cc.log("YOU WIN!");
									cc.director.runScene(new WinScene());
								}
								//cc.log("Left mouse released at "+event.getLocationX());
							}
						}

					}, this);
		}
		
		if (cc.sys.capabilities.hasOwnProperty('touches')){ //Set up mouse events
			cc.eventManager.addListener(
					{
						event: cc.EventListener.TOUCH_ONE_BY_ONE,
						onTouchBegan:function(touch, event){
				//			if (event.getButton() == cc.EventMouse.BUTTON_LEFT){
								for(k=0;k<noOfPieces;k++){
									//cc.log(touch.getLocationX());
									if(pieceSelected==-1){
										clickOffsetXBlock=0;
										clickOffsetYBlock=0;
									}
									var click=new cc.p(touch.getLocationX(),touch.getLocationY());
									var x=Math.floor((touch.getLocationX()-totalOffsetX)/20);
									var y=Math.floor((touch.getLocationY()-totalOffsetY)/20);
									cc.log(x + " " + y + " Clicked at")
									for(i=0;i<3;i++){
										for(j=0;j<3;j++){
											if(pieceList[k].positionarr[i][j]==1 && cc.rectContainsPoint(new cc.rect(totalOffsetX+(pieceList[k].basePositionX+i)*20,totalOffsetY+(pieceList[k].basePositionY+j)*20,20,20),click)){
												originalBaseX=pieceList[k].basePositionX;
												originalBaseY=pieceList[k].basePositionY;
												pieceSelected=k;
												recentPiece=k;
												clickOffsetXBlock=i;
												clickOffsetYBlock=j;
											}
										}
									}
									//cc.log("Left mouse clicked at "+touch.getLocationX());
								}
				//			}
								return true;
						},
						onTouchMoved: function (touch, event) {         
							//Move the position of current button sprite
							if(pieceSelected!=-1){
								for(i=0;i<3;i++){
									for(j=0;j<3;j++){
										if(pieceList[pieceSelected].positionarr[i][j]==1){
											var target=pieceList[pieceSelected].spriteBlocks[i][j].getPosition();
											var delta = touch.getDelta();
											target.x += delta.x;
											target.y += delta.y;
											pieceList[pieceSelected].spriteBlocks[i][j].setPosition(target);
										}
									}
								}
							}
						},
						onTouchEnded:function(touch, event){
			//				if (event.getButton() == cc.EventMouse.BUTTON_LEFT){
								if(pieceSelected!=-1){
									var x=Math.floor((touch.getLocationX()-totalOffsetX)/20);
									var y=Math.floor((touch.getLocationY()-totalOffsetY)/20);
									cc.log(x+" "+y);
									cc.log((x-clickOffsetXBlock) + " " + (y-clickOffsetYBlock) + " Left at")
									if(pieceList[pieceSelected].checkPiece(x-clickOffsetXBlock,y-clickOffsetYBlock,board)==1){
										pieceList[pieceSelected].placePiece(x-clickOffsetXBlock,y-clickOffsetYBlock,board);
										levelScore+=1;
									}
									else{
										pieceList[pieceSelected].placePiece(originalBaseX,originalBaseY,board);
									}
									pieceSelected=-1;
								}
								if(board.checkVictory()==1){
									cc.log("YOU WIN!");
									cc.director.runScene(new WinScene());
								}
								//cc.log("Left mouse released at "+touch.getLocationX());
						//	}
								return true;
						}

					}, this);
		}
		var menuItem = new cc.MenuItemImage(res.Back_png, res.Back_clicked_png, goToMenu);
		var menu = new cc.Menu(menuItem);
		menu.alignItemsVerticallyWithPadding(50);
		menu.setPosition(new cc.p(size.width/2,size.height/2-180))
		this.addChild(menu);
		return true;
	}
});

var GameMode3Layer = cc.Layer.extend({
	sprite:null,
	ctor:function (board,pieceList,noOfPieces) {
		//////////////////////////////
		// 1. super init first
		this._super();
		var size=cc.winSize;
		levelScore=0;
		currentMode=3;
		var background = new cc.Sprite.create(res.GameBackground_png);
		background.setPosition(new cc.p(0,0));
		background.setScale(size.width/background.getContentSize().width, size.height/background.getContentSize().height);
		background.setAnchorPoint(new cc.p(0,0));
		this.addChild(background);
		for(i=0;i<15;i++){
			for(j=0;j<15;j++){
				if(board.spriteBlocks[i][j])
					this.addChild(board.spriteBlocks[i][j]);
			}
		}
		var sizex=pieceList[0].positionarr.length;
		var sizey=pieceList[0].positionarr[0].length;
		for(i=0;i<sizex;i++){
			for(j=0;j<sizey;j++){
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
		//var actionmove = cc.MoveTo.create(1, new cc.p(300,300));
		//piece.spriteBlocks[0][0].runAction(actionmove);
		//piece.placePiece(1,4,board);
		//piece2.placePiece(6,7,board);

		var recentPiece=0;
		var clickOffsetXBlock=0;
		var clickOffsetYBlock=0;
		var originalBaseX=0;
		var originalBaseY=0;
		var pieceSelected=-1;
		var reference=this;

		if (cc.sys.capabilities.hasOwnProperty('keyboard')){
			cc.eventManager.addListener(
					{
						event: cc.EventListener.KEYBOARD,
						onKeyPressed:function(key,event){
							if(key==68){
								levelScore+=1;
								for(i=0;i<3;i++){
									for(j=0;j<3;j++){
										if(pieceList[recentPiece].positionarr[i][j]==1){
											reference.removeChild(pieceList[recentPiece].spriteBlocks[i][j]);
										}
									}
								}
								pieceList[recentPiece].rotatePiece(0,board);
								for(i=0;i<3;i++){
									for(j=0;j<3;j++){
										if(pieceList[recentPiece].positionarr[i][j]==1){
											reference.addChild(pieceList[recentPiece].spriteBlocks[i][j]);
										}
									}
								}
							}
							if(board.checkVictory()==1){
								cc.log("YOU WIN!");
								cc.director.runScene(new WinScene());
							}
						}
					},this);
		}
		
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
									var x=Math.floor((event.getLocationX()-totalOffsetX)/20);
									var y=Math.floor((event.getLocationY()-totalOffsetY)/20);
									cc.log(x + " " + y + " Clicked at")
									for(i=0;i<3;i++){
										for(j=0;j<3;j++){
											if(pieceList[k].positionarr[i][j]==1 && cc.rectContainsPoint(new cc.Rect(totalOffsetX+(pieceList[k].basePositionX+i)*20,totalOffsetY+(pieceList[k].basePositionY+j)*20,20,20),click)){
												originalBaseX=pieceList[k].basePositionX;
												originalBaseY=pieceList[k].basePositionY;
												pieceSelected=k;
												recentPiece=k;
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
									var x=Math.floor((event.getLocationX()-totalOffsetX)/20);
									var y=Math.floor((event.getLocationY()-totalOffsetY)/20);
									cc.log(x+" "+y);
									cc.log((x-clickOffsetXBlock) + " " + (y-clickOffsetYBlock) + " Left at")
									if(pieceList[pieceSelected].checkPiece(x-clickOffsetXBlock,y-clickOffsetYBlock,board)==1){
										pieceList[pieceSelected].placePiece(x-clickOffsetXBlock,y-clickOffsetYBlock,board);
										levelScore+=1;
									}
									else{
										pieceList[pieceSelected].placePiece(originalBaseX,originalBaseY,board);
									}
									pieceSelected=-1;
								}
								if(board.checkVictory()==1){
									cc.log("YOU WIN!");
									cc.director.runScene(new WinScene());
								}
								//cc.log("Left mouse released at "+event.getLocationX());
							}
						}

					}, this);
		}
		
		if (cc.sys.capabilities.hasOwnProperty('touches')){ //Set up mouse events
			cc.eventManager.addListener(
					{
						event: cc.EventListener.TOUCH_ONE_BY_ONE,
						onTouchBegan:function(touch, event){
			//				if (event.getButton() == cc.EventMouse.BUTTON_LEFT){
								for(k=0;k<noOfPieces;k++){
									//cc.log(touch.getLocationX());
									if(pieceSelected==-1){
										clickOffsetXBlock=0;
										clickOffsetYBlock=0;
									}
									var click=new cc.p(touch.getLocationX(),touch.getLocationY());
									var x=Math.floor((touch.getLocationX()-totalOffsetX)/20);
									var y=Math.floor((touch.getLocationY()-totalOffsetY)/20);
									cc.log(x + " " + y + " Clicked at")
									for(i=0;i<3;i++){
										for(j=0;j<3;j++){
											if(pieceList[k].positionarr[i][j]==1 && cc.rectContainsPoint(new cc.rect(totalOffsetX+(pieceList[k].basePositionX+i)*20,totalOffsetY+(pieceList[k].basePositionY+j)*20,20,20),click)){
												originalBaseX=pieceList[k].basePositionX;
												originalBaseY=pieceList[k].basePositionY;
												pieceSelected=k;
												recentPiece=k;
												clickOffsetXBlock=i;
												clickOffsetYBlock=j;
											}
										}
									}
									//cc.log("Left mouse clicked at "+touch.getLocationX());
								}
			//				}
								return true;
						},
						onTouchMoved: function (touch, event) {         
							//Move the position of current button sprite
							if(pieceSelected!=-1){
								for(i=0;i<3;i++){
									for(j=0;j<3;j++){
										if(pieceList[pieceSelected].positionarr[i][j]==1){
											var target=pieceList[pieceSelected].spriteBlocks[i][j].getPosition();
											var delta = touch.getDelta();
											target.x += delta.x;
											target.y += delta.y;
											pieceList[pieceSelected].spriteBlocks[i][j].setPosition(target);
										}
									}
								}
							}
						},
						onTouchEnded:function(touch, event){
		//					if (event.getButton() == cc.EventMouse.BUTTON_LEFT){
								if(pieceSelected!=-1){
									var x=Math.floor((touch.getLocationX()-totalOffsetX)/20);
									var y=Math.floor((touch.getLocationY()-totalOffsetY)/20);
									cc.log(x+" "+y);
									cc.log((x-clickOffsetXBlock) + " " + (y-clickOffsetYBlock) + " Left at")
									if(pieceList[pieceSelected].checkPiece(x-clickOffsetXBlock,y-clickOffsetYBlock,board)==1){
										pieceList[pieceSelected].placePiece(x-clickOffsetXBlock,y-clickOffsetYBlock,board);
										levelScore+=1;
									}
									else{
										pieceList[pieceSelected].placePiece(originalBaseX,originalBaseY,board);
									}
									pieceSelected=-1;
								}
								if(board.checkVictory()==1){
									cc.log("YOU WIN!");
									cc.director.runScene(new WinScene());
								}
								//cc.log("Left mouse released at "+touch.getLocationX());
			//				}
								return true;
						}

					}, this);
		}
		var menuItem = new cc.MenuItemImage(res.Back_png, res.Back_clicked_png, goToMenu);
		var menu = new cc.Menu(menuItem);
		menu.alignItemsVerticallyWithPadding(50);
		menu.setPosition(new cc.p(size.width/2,size.height/2-180))
		this.addChild(menu);
		return true;
	}
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
//			menuItems[i] = new cc.MenuItemFont("Level "+j.toString(), // level number maker
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

var goToMenu=function(){
	cc.director.runScene(new MenuScene());
}

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

var LevelScene = cc.Scene.extend({
	onEnter:function () {
		this._super();
		var layer6 = new LevelLayer(creationGameMode);
		this.addChild(layer6);
	}
});

var ScoreScene = cc.Scene.extend({
	onEnter:function () {
		this._super();
		var layer5 = new ScoreLayer();
		this.addChild(layer5);
	}
});

var AchievementScene = cc.Scene.extend({
	onEnter:function () {
		this._super();
		var layer6 = new AchievementLayer();
		this.addChild(layer6);
	}
});

var MenuScene = cc.Scene.extend({
	onEnter:function () {
		this._super();
		var layer = new MenuLayer();
		this.addChild(layer);
	}
});


var WinScene = cc.Scene.extend({
	onEnter:function () {
		this._super();
		var layer2 = new WinLayer();
		this.addChild(layer2);
	}
});


var GameMode1Scene1 = cc.Scene.extend({
	onEnter:function () {
		this._super();
		var size=cc.winSize;
		currentMode=1;
		currentLevel=1;
		totalOffsetX=size.width/2-150;
		totalOffsetY=size.height/2-150;
		
		var temparr = new Array(15);
		var numofpieces=2;
		var arr = new Array(15);
		var kk;
		for(kk=0;kk<15;kk++){
			arr[kk]=new Array(15);
			temparr[kk]=new Array(15);
			var jj;
			for(jj=0;jj<15;jj++){
				temparr[kk][jj]=0;
			}
		}
		var i,j;
		var status=0;
		var i,j,k,a,b,c,n,m;
		var state=0;
		while(state==0){
			for(i=1;i<=4;i++){
				for(j=1;j<=3;j++){
					cc.log(Math.random()*10);
					arr[i][j]=Math.floor(Math.random()*10)%numofpieces+1;
					//arr[i][j]=1;
				}
			}
			for(k=0;k<1;k++){
				for(i=1;i<=4;i++){
					for(j=1;j<=3;j++){
						var arr2 = new Array(100);
						var ii;
						for(ii=0;ii<100;ii++){
							arr2[ii]=0;
						}
						var i1,j1;
						for(i1=0;i1<3;i1++){
							for(j1=0;j1<3;j1++){
								arr2[arr[i+i1-1][j+j1-1]]+=1;
							}
						}
						var maxx=0;
						var val=0;
						for(i1=1;i1<=numofpieces;i1++){
							if(arr2[i1]>maxx)
							{
								maxx=arr2[i1];
								val=i1;
							}
						}
						arr[i][j]=val;
					}
				}
			}
			var statis=0;
			for(i=1;i<=4;i++){
				for(j=1;j<=3;j++){
					if(arr[i][j]!=arr[1][1]){
						statis=1;;
					}
				}
			}
			for(i=1;i<=numofpieces;i++){
				var cnts=0;
				for(j=1;j<=4;j++){
					for(k=1;k<=3;k++){
						if(arr[j][k]==i)
							cnts++;
					}
				}
				if(cnts==1)
					statis=0;
			}
			if(statis==0)
				state=0;
			else
				state=1;
		}
		//cc.log(arr);
		var vi,vj,vk;
		for(vi=5;vi<=8;vi++){
			for(vj=5;vj<=7;vj++){
				temparr[vi][vj]=1;
			}
		}
		
		var board = new Board(temparr);
		var pieceList = new Array(5);
		var noOfPieces=numofpieces;
		for(i=1;i<=noOfPieces;i++){
			//var x1=0;
			//var x2=0;
			var x1=Math.floor(Math.random()*10)%(5)+((i-1)*7);
			var y1=Math.floor(Math.random()*10)%(5)+((i-1)*7);
			var piece = new Piece(x1,y1,i-1);
			board.belongPieces[i-1]=piece;
			pieceList[i-1]=piece;
			var arrpiec=new Array(4);
			for(j=0;j<4;j++){
				arrpiec[j]=new Array(4);
				for(k=0;k<4;k++){
					arrpiec[j][k]=0;
				}
			}
			var statss=0;
			var startx=0,starty=0;
			for(j=1;j<=4;j++){
				for(k=1;k<=3;k++){
					if(arr[k][j]==i){
						startx=k;
						starty=j;
						statss=1;
					}
				}
			}
			//cc.log("YOYO");
			//cc.log(arr);
			for(j=1;j<=4;j++){
				for(k=1;k<=3;k++){
					//cc.log(arr[j][k]);
					if(arr[j][k]==i){
						//cc.log("YESSS");
						//cc.log(startx,starty,j,k);
						arrpiec[j-1][k-1]=1;
					}
				}
			}
			piece.initpositionarr(arrpiec);
		}
		var layer2 = new GameMode1Layer(board,pieceList,noOfPieces);
		this.addChild(layer2);
	}
});

var GameMode2Scene1 = cc.Scene.extend({
	onEnter:function(){
		this._super();
		var size=cc.winSize;
		currentMode=2;
		currentLevel=1;
		totalOffsetX=size.width/2-150;
		totalOffsetY=size.height/2-150;
		/////////////////////////////
		// 2. add a menu item with "X" image, which is clicked to quit the program
		//    you may modify it.
		// ask the window size


		//(0,0) is the bottom left point.
		var boardarray=new Array(15);
		for(i=0;i<15;i++){
			boardarray[i]=new Array(15);
			for(j=0;j<15;j++){
				boardarray[i][j]=0;
			}
		}
		for(i=4;i<8;i++){
			for(j=4;j<7;j++){
				boardarray[i][j]=1;
			}
		}
		var board = new Board(boardarray);
		//var board = new BoardSprite(res.CloseSelected_png,cc.rect(300,300,200,200));
		var pieceList = new Array(5);
		var noOfPieces=3;
		var piece = new Piece(1,0,0);
		var piece2 = new Piece(10,5,1);
		var piece3 = new Piece(12,1,2);
		board.belongPieces[0]=piece;
		board.belongPieces[1]=piece2;
		board.belongPieces[2]=piece3;
		//var piece3 = new Piece(7,1,2);
		var arr=new Array(3);
		var arr2=new Array(3);
		var arr3=new Array(3);
		for(i=0;i<3;i++){
			arr[i]=new Array(3);
			arr2[i]=new Array(3);
			arr3[i]=new Array(3);
			for(j=0;j<3;j++){
				arr2[i][j]=1;
			}
		}
		arr[0][0]=1;
		arr[0][1]=1;
		arr[0][2]=1;
		arr3[0][0]=1;
		arr3[0][1]=1;
		arr3[0][2]=1;
		arr3[1][0]=1;
		arr3[2][0]=1;
		piece.initpositionarr(arr);
		piece2.initpositionarr(arr2);
		piece3.initpositionarr(arr3);
		pieceList[0]=piece;
		pieceList[1]=piece2;
		pieceList[2]=piece3;
		var layer3=new GameMode2Layer(board,pieceList,3);
		this.addChild(layer3);
	}
});

var GameMode3Scene1 = cc.Scene.extend({
	onEnter:function(){
		this._super();
		var size=cc.winSize;
		currentMode=3;
		currentLevel=1;
		totalOffsetX=size.width/2-150;
		totalOffsetY=size.height/2-150;
		/////////////////////////////
		// 2. add a menu item with "X" image, which is clicked to quit the program
		//    you may modify it.
		// ask the window size


		//(0,0) is the bottom left point.
		var boardarray=new Array(15);
		for(i=0;i<15;i++){
			boardarray[i]=new Array(15);
			for(j=0;j<15;j++){
				boardarray[i][j]=0;
			}
		}
		for(i=4;i<8;i++){
			for(j=4;j<7;j++){
				boardarray[i][j]=1;
			}
		}
		for(i=9;i<13;i++){
			for(j=9;j<12;j++){
				boardarray[i][j]=1;
			}
		}
		var board = new Board(boardarray);
		//var board = new BoardSprite(res.CloseSelected_png,cc.rect(300,300,200,200));
		var pieceList = new Array(5);
		var noOfPieces=4;
		var piece = new Piece(1,0,0);
		var piece2 = new Piece(10,5,1);
		var piece3 = new Piece(12,1,2);
		var piece4 = new Piece(2,10,3);
		board.belongPieces[0]=piece;
		board.belongPieces[1]=piece2;
		board.belongPieces[2]=piece3;
		board.belongPieces[3]=piece4;
		//var piece3 = new Piece(7,1,2);
		var arr=new Array(3);
		var arr2=new Array(3);
		var arr3=new Array(3);
		var arr4=new Array(3);
		for(i=0;i<3;i++){
			arr[i]=new Array(3);
			arr2[i]=new Array(3);
			arr3[i]=new Array(3);
			arr4[i]=new Array(3);
			for(j=0;j<3;j++){
				arr2[i][j]=1;
			}
		}
		arr[0][0]=1;
		arr[0][1]=1;
		arr[0][2]=1;
		arr3[0][0]=1;
		arr3[0][1]=1;
		arr3[0][2]=1;
		arr3[1][0]=1;
		arr3[2][0]=1;
		arr4[1][1]=1;
		arr4[1][2]=1;
		arr4[2][1]=1;
		arr4[2][2]=1;
		arr4[0][1]=1;
		arr4[0][2]=1;
		arr4[2][0]=1;
		piece.initpositionarr(arr);
		piece2.initpositionarr(arr2);
		piece3.initpositionarr(arr3);
		piece4.initpositionarr(arr4);
		pieceList[0]=piece;
		pieceList[1]=piece2;
		pieceList[2]=piece3;
		pieceList[3]=piece4;
		var layer4=new GameMode3Layer(board,pieceList,4);
		this.addChild(layer4);
	}
});