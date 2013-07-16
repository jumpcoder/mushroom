
var MushroomSprite = cc.Sprite.extend({
	
	ctor:function(){
		this._super();
		//赋予图片
		this.initWithFile(s_mushroom);
		this.radius = 40;
		cc.Director.getInstance().getTouchDispatcher().addTargetedDelegate(this, 0, true);
	},
	containsTouchLocation:function(touch){
		//获取触摸点位置
		var getPoint = touch.getLocation();
		//获取图片区域尺寸
		var contentSize = this.getContentSize();
		//定义拖拽的区域
		var myRect = cc.rect(0,0,contentSize.width,contentSize.height);
		myRect.origin.x += this.getPosition().x - this.getContentSize().width/2;
		myRect.origin.y += this.getPosition().y - this.getContentSize().height/2;
		
		//判断点击是否在区域上
		return cc.rectContainsPoint(myRect, getPoint);
	},
	onTouchBegan:function(touch, event){
		if(!this.containsTouchLocation(touch)) return false;//判断触摸点是否在蘑菇上
		return true;
	},
	onTouchMoved:function(touch,event){
		cc.log('onTouchMoved');
		var touchPoint = touch.getLocation();
		this.setPositionX(touchPoint.x);//设置x轴位置等于触摸的x位置
	}
});
