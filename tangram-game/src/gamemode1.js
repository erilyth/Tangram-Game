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

var GameMode1Scene1 = cc.Scene.extend({
	onEnter:function () {
		this._super();
		var size=cc.winSize;
		currentMode=1;
		currentLevel=1;
		totalOffsetX=size.width/2-150;
		totalOffsetY=size.height/2-150;

		var temparr = new Array(15);
		var numofpieces=3;
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
		//This is where the pieces are randomly generated. We use "Cellular Automata" to do this. First we randomly assign values
		//to each of the array elements and then we iterate over them a few times making them similar to their neighbours, so that after a few iterations
		//we get groups of adjacent blocks which are alike which we treat as single pieces.
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
			var piecefound = new Array(4);
			for(j=1;j<=4;j++){
				piecefound[j]=0;
			}
			for(j=1;j<=4;j++){
				for(k=1;k<=3;k++){
					piecefound[arr[j][k]]+=1;
				}
			}
			cc.log(piecefound);
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
			for(i=1;i<=numofpieces;i++){
				if(piecefound[i]==0){
					statis=0;
					cc.log("DSAD");
				}
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
			var x1=0;
			var x2=0;
			if(i==0){
				x1=Math.floor(Math.random()*10)%(3);
				y1=Math.floor(Math.random()*10)%(3);
			}
			if(i==1){
				x1=Math.floor(Math.random()*10)%(3)+6;
				y1=Math.floor(Math.random()*10)%(3)+6;
			}
			if(i==2){
				x1=Math.floor(Math.random()*10)%(3)+3;
				y1=Math.floor(Math.random()*10)%(3)+3;
			}
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