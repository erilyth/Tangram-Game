var Piece= cc.Class.extend({
	color:"blue",
	blockWidth:50,
	basePositionX:0,
	basePositionY:0,
	ctor:function(x,y){
		this.basePositionX=x;
		this.basePositionY=y;
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
					this.spriteBlocks[i][j].setScale(50/this.spriteBlocks[i][j].getContentSize().width,50/this.spriteBlocks[i][j].getContentSize().height);	
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
		//cc.log(a);
		//cc.log(b);
		for(i=0;i<3;i++){
			for(j=0;j<3;j++){
				if(this.positionarr[i][j]==1){
					boardObj.positionarr[i+this.basePositionX][j+this.basePositionY]=0;
				}
			}
		}
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
				else if(boardObj.positionarr[i+a][j+b]==1 && this.positionarr[i][j]==1){
					state=1;
				}
			}
		}
		for(i=0;i<3;i++){
			for(j=0;j<3;j++){
				if(this.positionarr[i][j]==1){
					boardObj.positionarr[i+this.basePositionX][j+this.basePositionY]=1;
				}
			}
		}
		if(state==0)
			return 1;
		else
			return 0;
	},
	placePiece:function(a,b,boardObj){
		if(this.checkPiece(a,b,boardObj)==1){
			for(i=0;i<3;i++){
				for(j=0;j<3;j++){
					if(this.positionarr[i][j]==1){
						boardObj.positionarr[i+this.basePositionX][j+this.basePositionY]=0;
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
						boardObj.positionarr[i+this.basePositionX][j+this.basePositionY]=this.positionarr[i][j];
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
				this.spriteBlocks[i][j]=  new cc.Sprite.create(res.Board_png);
				this.positionarr[i][j]=0;
				this.spriteBlocks[i][j].setPosition(new cc.p(50*i,50*j));
				this.spriteBlocks[i][j].setScale(50/this.spriteBlocks[i][j].getContentSize().width,50/this.spriteBlocks[i][j].getContentSize().height);
				this.spriteBlocks[i][j].setAnchorPoint(new cc.p(0,0));
			}
		}
	},
//add your properties and functions
});

var HelloWorldLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;
        //(0,0) is the bottom left point.
        var board = new Board();
        //var board = new BoardSprite(res.CloseSelected_png,cc.rect(300,300,200,200));
        var piece = new Piece(0,0);
        var piece2 = new Piece(5,5);
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
        arr[1][1]=1;
        arr[2][2]=1;
        piece.initpositionarr(arr);
        //piece2.initpositionarr(arr2);
        for(i=0;i<15;i++){
        	for(j=0;j<15;j++){
        		this.addChild(board.spriteBlocks[i][j]);
        	}
        }
        for(i=0;i<3;i++){
        	for(j=0;j<3;j++){
        		if(piece.positionarr[i][j]==1){
        			this.addChild(piece.spriteBlocks[i][j]);
        		}
        		//if(piece2.positionarr[i][j]==1){
        		//	this.addChild(piece2.spriteBlocks[i][j]);
        		//}
        	}
        }
        //var actionmove = cc.MoveTo.create(1, cc.p(300,300));
        //piece.spriteBlocks[0][0].runAction(actionmove);
        //piece.placePiece(1,4,board);
        //piece2.placePiece(6,7,board);
        
        var clickOffsetXBlock=0;
        var clickOffsetYBlock=0;
        var originalBaseX=0;
        var originalBaseY=0;
        var pieceSelected=0;
        
        if (cc.sys.capabilities.hasOwnProperty('mouse')){ //Set up mouse events
        	cc.eventManager.addListener(
        			{
        				event: cc.EventListener.MOUSE,
        				onMouseDown:function(event){
        					if (event.getButton() == cc.EventMouse.BUTTON_LEFT){
        						originalBaseX=piece.basePositionX;
        						originalBaseY=piece.basePositionY;
        						//cc.log(event.getLocationX());
        						clickOffsetXBlock=0;
        						clickOffsetYBlock=0;
        						var click=cc.p(event.getLocationX(),event.getLocationY());
        						var x=Math.floor((event.getLocationX())/50);
        						var y=Math.floor((event.getLocationY())/50);
        						//cc.log(x + " " + y + " Clicked at")
        						for(i=0;i<3;i++){
        							for(j=0;j<3;j++){
        								if(piece.positionarr[i][j]==1 && cc.rectContainsPoint(new cc.Rect((piece.basePositionX+i)*50,(piece.basePositionY+j)*50,50,50),click)){
        									pieceSelected=1;
        									clickOffsetXBlock=i;
        									clickOffsetYBlock=j;
        								}
        							}
        						}
        						//cc.log("Left mouse clicked at "+event.getLocationX());
        					}
        				},
        				onMouseMove: function (event) {         
        					//Move the position of current button sprite
        					if(pieceSelected==1){
        						for(i=0;i<3;i++){
        							for(j=0;j<3;j++){
        								if(piece.positionarr[i][j]==1){
        									var target=piece.spriteBlocks[i][j].getPosition();
        									var delta = event.getDelta();
        									target.x += delta.x;
        									target.y += delta.y;
        									piece.spriteBlocks[i][j].setPosition(target);
        								}
        							}
        						}
        					}
        				},
        				onMouseUp:function(event){
        					if (event.getButton() == cc.EventMouse.BUTTON_LEFT){
        						if(pieceSelected==1){
	        						pieceSelected=0;
	        						var click2=cc.p(event.getLocationX(),event.getLocationY());
	        						var x=Math.floor((event.getLocationX())/50);
	        						var y=Math.floor((event.getLocationY())/50);
	        						cc.log((x-clickOffsetXBlock) + " " + (y-clickOffsetYBlock) + " Left at")
	        						if(piece.checkPiece(x-clickOffsetXBlock, y-clickOffsetYBlock, board)==1){
	        							piece.placePiece(x-clickOffsetXBlock,y-clickOffsetYBlock,board);
	        						}
	        						else{
	        							piece.placePiece(originalBaseX,originalBaseY,board);
	        						}
        						}
        						//cc.log("Left mouse released at "+event.getLocationX());
        					}
        				}

        			}, this);
        }
        
        //piece.initpositionarr();
        //this.addChild(piece);
        //this.addChild(piece, 0);
        //this.addChild(board, 0);
        //this.addChild(piece, 0);
        
        // add a "close" icon to exit the progress. it's an autorelease object
        /*var closeItem = new cc.MenuItemImage(
            res.CloseNormal_png,
            res.CloseSelected_png,
            function () {
                cc.log("Menu is clicked!");
            }, this);
        closeItem.attr({
            x: size.width - 20,
            y: 20,
            anchorX: 0.5,
            anchorY: 0.5
        });

        var menu = new cc.Menu(closeItem);
        menu.x = 0;
        menu.y = 0;
        //this.addChild(menu, 1);

        /////////////////////////////
        // 3. add your codes below...
        // add a label shows "Hello World"
        // create and initialize a label
        var helloLabel = new cc.LabelTTF("Hello World", "Arial", 38);
        // position the label on the center of the screen
        helloLabel.x = size.width / 2;
        helloLabel.y = 0;
        // add the label as a child to this layer
        //this.addChild(helloLabel, 5);

        // add "HelloWorld" splash screen"
        this.sprite = new cc.Sprite(res.HelloWorld_png);
        this.sprite.attr({
            x: size.width / 2,
            y: size.height / 2,
            scale: 0.5,
            rotation: 180
        });
        this.addChild(this.sprite, 0);

        this.sprite.runAction(
            cc.sequence(
                cc.rotateTo(2, 0),
                cc.scaleTo(2, 1, 1)
            )
        );
        helloLabel.runAction(
            cc.spawn(
                cc.moveBy(2.5, cc.p(0, size.height - 40)),
                cc.tintTo(2.5,255,125,0)
            )
        );*/
        return true;
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

