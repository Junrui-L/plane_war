

//我的飞机（对象）
var myPlane = {
	
	//属性： ele 
	//      fireInterval
	ele: null,
	fireInterval: 60, //发射子弹的时间间隔
	myPlane_HP: 8,
	
	//方法
	//初始化方法
	init: function() {
		this.ele = document.createElement("div");
		this.ele.className = "myplane";//css样式
		document.body.appendChild(this.ele);//添加
		
		
		//自己飞机位置
		var left = gameEngine.ele.offsetLeft + gameEngine.ele.offsetWidth/2 - this.ele.offsetWidth/2;
		this.ele.style.left = left + "px";
		this.ele.style.bottom = 0;
		
		return this;
	},
	
	//自动发射子弹
	autoFire: function() {
		setInterval(function(){
			
			//创建子弹
			var bullet = new Bullet();
			bullet.init().move();
			
		}, this.fireInterval)
	},
	
	//飞机炸毁
	dieBoom: function() {
		var index = 0;
		var self = this;
		var dieImgs = ["images/me_die1.png", "images/me_die2.png", "images/me_die3.png", "images/me_die4.png"]
		var dieTimer = setInterval(function(){
				if(index == dieImgs.length) {
					clearInterval(dieTimer);//清除定时器
					self.destroy();
				}
				else {
					//切换图片
					self.ele.style.background = "url(" + dieImgs[index] + ")";
					index++;
				}	
	
		}, 200)
		
		//我机机销毁
		this.destroy = function() {
			document.body.removeChild(this.ele);
		}
	}
	
}
