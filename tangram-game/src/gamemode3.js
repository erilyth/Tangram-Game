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