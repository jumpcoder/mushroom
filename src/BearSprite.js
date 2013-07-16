
var BearSprite = cc.Sprite.extend({
	ctor:function(){
		this._super();
		this.initWithFile(s_bear_eyesopen);
		//表示熊移动方向的向量
		this.velocity = cc.p(100,100);
		
		this.radius = 25;
	},
	beginRotate:function(){
		var rotate = cc.RotateBy.create(2,360); 
		var rep1 = cc.RepeatForever.create(rotate);//循环旋转
		this.runAction(rep1);//执行
	},
	stopRotate:function(){
		this.stopAllActions();
	},
	update:function(dt){
		this.setPosition(cc.pAdd(this.getPosition(), cc.pMult(this.velocity, dt)));
		this.checkHitEdge();
	},
	checkHitEdge:function(){
		var pos = this.getPosition();
		var winSize = cc.Director.getInstance().getWinSize();
		//熊碰到右边边界
		if(pos.x + this.radius > winSize.width){
			this.velocity.x *= -1; //改变水平速度方向
		}
		//熊碰到左边界
		if(pos.x - this.radius < 0){
			this.velocity.x *= -1; //改变水平速度方向
		}
		//熊碰到下边界
		if(pos.y - this.radius <= 0){
			//减少1生命
			this.curSence.reduceLives();
			//this.velocity.y *= -1;
		}
		//熊碰到上边界
		if(pos.y + this.radius >= winSize.height){
			this.velocity.y *= -1;
		}
	},
	//碰撞检测、假如碰撞，修改方向往反角度移动并返回true，否则返回false
	collide:function(gameObject){
		var hit = false;
		var distance = cc.pDistance(this.getPosition(), gameObject.getPosition());//两者之间的距离
		//计算碰撞角度，往反方向弹回去
		if(distance <= this.radius + gameObject.radius){
			hit = true;
			//计算碰撞角度，并算出该角度对应的速度
			var hitAngle = cc.pToAngle(cc.pSub(gameObject.getPosition(), this.getPosition()));
			var scalarVelocity = cc.pLength(this.velocity);
			this.velocity = cc.pMult(cc.pForAngle(hitAngle), scalarVelocity);
			//反方向移动
			this.velocity.x *= -1;
			this.velocity.y *= -1;
		}
		return hit;
	}
	
});