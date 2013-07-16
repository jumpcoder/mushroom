var g_GameZOrder = {bg:0, ui:1, front:100};//游戏中显示的层级
var g_GameStatus = {normal:0, stop:1, gameOver:2};//游戏的状态，0:正常，1：暂停，2：游戏结束

var GameScene = cc.Scene.extend({
	onEnter:function(){
		this._super();
		this.initData();
		//参数1：将要执行的汗水，参数2：每次调用的间隔时间，0代表每帧都调用
		this.schedule(this.update,0);
		
	},
	
	initData:function(){
		//默认暂停
		this.gameStatus = g_GameStatus.stop;
		
		//添加Layer
		this.gameLayer = cc.Layer.create();
		this.addChild(this.gameLayer);
		
		//开始按钮
		var start1 = cc.Sprite.create(s_start_button);
		var start2 = cc.Sprite.create(s_start_button);
		
		this.btnStart = cc.MenuItemSprite.create(start1, start2, this.startGame, this);
		var infoMenu = cc.Menu.create(this.btnStart);
		
		this.gameLayer.addChild(infoMenu, g_GameZOrder.front);
		//infoMenu.setPosition(cc.p(0,0));
		
		//添加背景精灵
		var bg = cc.Sprite.create(s_forest1);
		this.gameLayer.addChild(bg, g_GameZOrder.bg);
		
		//设置背景的锚点和位置
		bg.setAnchorPoint(cc.p(0,0));
		bg.setPosition(cc.p(0,0));
		
		
		//添加蘑菇精灵
		this.mushroom = new MushroomSprite();
		this.mushroom.setAnchorPoint(cc.p(0.5,0));
		this.mushroom.setPosition(cc.p(240,0));
		this.gameLayer.addChild(this.mushroom,g_GameZOrder.ui);
		
		//添加熊
		this.bear = new BearSprite();
		this.bear.setPosition(cc.p(240,60));
		this.gameLayer.addChild(this.bear,g_GameZOrder.ui);
		//this.bear.beginRotate();
		//使熊可以访问当前场景
		this.bear.curSence = this;
		
		
		this.leafList = [];
		this.acornList = [];
		this.flowerList = [];
		
		this.initAcorn();
		this.initFlower();
		this.initLeaf();
		
		this.winSize = cc.Director.getInstance().getWinSize();
		
		this.lblLives = null;//生命标签
		this.lives = 5;//生命数
		
		this.lblLives = cc.Sprite.create(s_lives5);
		this.lblLives.setAnchorPoint(cc.p(0,1));
		this.lblLives.setPosition(cc.p(0, this.winSize.height));
		this.gameLayer.addChild(this.lblLives, g_GameZOrder.bg);
		
		this.lblSore = null; //分数标签
		this.score = 0; //分数
		var bgScore = cc.Sprite.create(s_score);
		bgScore.setAnchorPoint(cc.p(1,1));
		bgScore.setPosition(cc.p(this.winSize.width, this.winSize.height));
		this.gameLayer.addChild(bgScore, g_GameZOrder.bg);
		
		//添加分数
		this.lblScore = cc.LabelTTF.create('0','Arial',18);
		this.lblScore.setPosition(cc.p(this.winSize.width - 30, this.winSize.height -21));
		this.lblScore.setColor(cc.c3b(117,76,36));//设置颜色
		this.gameLayer.addChild(this.lblScore, g_GameZOrder.ui);
		
	},
	startGame:function(){
		if(this.gameStatus === g_GameStatus.gameOver){
			console.log('here');
			this.resetData();
		}
		this.gameStatus = g_GameStatus.normal; //设置游戏状态为正常
		this.bear.beginRotate(); //熊开始旋转
		this.btnStart.setVisible(false); //隐藏开始按钮
	},
	overGame:function(){
		this.gameStatus = g_GameStatus.gameOver; //设置游戏状态为结束
		this.bear.stopRotate(); //停止旋转
		this.btnStart.setVisible(true);  //显示开始按钮
	},
	resetData:function(){
		//重设生命值
		this.lives = 5;
		this.lblLives.initWithFile('lives5.png');
		//重置蘑菇
		this.mushroom.setPosition(cc.p(240,0));
		//重置熊
		this.bear.setPosition(cc.p(240,60));
		this.bear.velocity = cc.p(100,100);
		//重置叶子
		for(var i = 0; i < this.leafList.length; i++){
			var prize = this.leafList[i];
			prize.isHit = false;
			prize.setVisible(true);
		}
		//重置花
		for(var i = 0; i < this.flowerList.length; i++){
			var prize = this.flowerList[i];
			prize.isHit = false;
			prize.setVisible(true);
		}
		//重置橡子
		for(var i = 0; i < this.acornList.length; i++){
			var prize = this.acornList[i];
			prize.isHit = false;
			prize.setVisible(true);
		}
		
	},
	
	update:function(dt){
		//判断游戏状态
		if(this.gameStatus != g_GameStatus.normal){
			return ;
		}
	
		//dt为每帧所消耗的时间，单位为秒
		this.bear.update(dt);
		//判断熊与蘑菇的碰撞
		this.bear.collide(this.mushroom);
		
		//判断熊与叶子碰撞
		for(var i = 0; i < this.leafList.length; i++){
			var prize = this.leafList[i];
			if(!prize.isHit){
				if(this.bear.collide(prize)){
					prize.setVisible(false); //隐藏
					prize.isHit = true; //设置为已碰撞，下次循环不检测
					this.addScore(prize.point);//添加分数
				}
				
			}
		}
		//判断熊于花碰撞
		for(var i = 0; i < this.flowerList.length; i++){
			var prize = this.flowerList[i];
			//判断没被碰撞则检测
			if(!prize.isHit){
				if(this.bear.collide(prize)){
					prize.setVisible(false); //隐藏
					prize.isHit = true;//设置已被碰撞，下次循环不检测
					this.addScore(prize.point);//添加分数
				}
				
			}
		}
		//判断熊于花碰撞
		for(var i = 0; i < this.acornList.length; i++){
			var prize = this.acornList[i];
			//判断没被碰撞则检测
			if(!prize.isHit){
				if(this.bear.collide(prize)){
					prize.setVisible(false); //隐藏
					prize.isHit = true;//设置已被碰撞，下次循环不检测
					this.addScore(prize.point);//添加分数
				}
				
			}
		}
		
		
	},
	
	initAcorn:function(){
		var left = 0; //左边距离
		var space = 30; //间距
		for(var i = 1; i <= 15; i++){
			//添加15个
			var prize = new AcornPrize();
			prize.setPosition(cc.p(left + i*space, 270));
			this.gameLayer.addChild(prize, g_GameZOrder.ui);
			this.acornList.push(prize);
			
		}
	},
	initFlower:function(){
		var left = 30;
		var space = 30;
		for(var i = 1; i <= 13; i++){
			var prize = new FlowerPrize();
			prize.setPosition(cc.p(left + i * space, 245));
			this.gameLayer.addChild(prize, g_GameZOrder.ui);
			this.flowerList.push(prize);
		}
	},
	initLeaf:function(){
		var left = 60;
		var space = 30;
		for(var i = 1; i <= 11; i++){
			var prize = new LeafPrize();
			prize.setPosition(cc.p(left + i * space, 220));
			this.gameLayer.addChild(prize, g_GameZOrder.ui);
			this.leafList.push(prize);
		}
	},
	reduceLives:function(){
		this.lives -= 1; //减少生命值1
		this.lblLives.initWithFile('lives' + this.lives + '.png');
		this.lblLives.setAnchorPoint(cc.p(0,1)); //重置锚点
		
		if(this.lives <= 0){
			//生命值为0，游戏结束
			this.overGame();
		}else{
			this.gameStatus = g_GameStatus.normal;
			//重置熊
			this.bear.setPosition(cc.p(240,60));
			this.bear.velocity = cc.p(100,100);
		}
	},
	addScore:function(point){
		this.score += point; //累计分数
		this.lblScore.setString(this.score.toString()); //修改分数显示
	}
});