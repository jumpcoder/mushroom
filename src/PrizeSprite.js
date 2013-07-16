
//奖品基类
var PrizeSprite = cc.Sprite.extend({
	
});

//叶子
var LeafPrize = PrizeSprite.extend({
	ctor:function(){
		this._super();
		this.initWithFile(s_leaf);
		this.initData();
	},
	initData:function(){
		this.isHit =false;
		this.point = 10; //分数
		this.radius = 15; //碰撞半径
	}

});

//花
var FlowerPrize = PrizeSprite.extend({
	ctor:function(){
		this._super();
		this.initWithFile(s_flower);
		this.initData();
	},
	initData:function(){
		this.isHit = false;
		this.point = 20;
		this.radius = 15;
	}
});
//橡子
var AcornPrize = PrizeSprite.extend({
	ctor:function(){
		this._super();
		this.initWithFile(s_acorn);
		this.initData();
	},
	initData:function(){
		this.isHit = false;
		this.point = 30;
		this.radius = 15;
	}
});