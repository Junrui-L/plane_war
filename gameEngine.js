

//游戏引擎
var gameEngine = {
	
	bulletList: {}, //保存所有最新的屏幕上的子弹
	enemyList: {}, //保存所有最新的屏幕上的敌机
	
	
	ele: null,
	
	init: function() {
		this.ele = document.getElementById("body_main");
		return this;
	},
	
	//开始游戏
	start: function() {
		//游戏加载页面
		this.loading(function() {
			//此时加载页面已经结束了
			//正式开始游戏
			//移动背景
			gameEngine.moveBG();
			//显示我的飞机,并子弹发射子弹
			myPlane.init().autoFire();
			//鼠标，键盘监听
			gameEngine.mouseMove();
			gameEngine.keyListening();
			
			//创建敌机
			gameEngine.createEnemy();	
			
			//开启碰撞检测
			gameEngine.crashListening();
		});
	},
	
	//移动背景
	moveBG: function () {
		var backgroundY = 0;
		var BG = document.getElementById("body_main");
		bgTimer = setInterval(function() {
			backgroundY += 9;
			BG.style.backgroundPosition = "0 " + backgroundY + "px";
			if(backgroundY == BG.offsetHeight) {
				backgroundY = 0;
			}
		}, 20)
	},
	
	
	//加载游戏
	loading: function(callback) {
		
		logo.init().show();
		
		//创建加载的元素节点
		var loadingEle = document.createElement("div");
		loadingEle.className = "loading";
		document.body.appendChild(loadingEle);
		
		
		//定时器切换加载图片的图片
		var index = 0;
		var loadImages = ["images/loading1.png", "images/loading2.png", "images/loading3.png"]
		var timer = setInterval(function(){
			
			//当index = 6时，正式进入游戏
			if(index == 3) {
				clearInterval(timer);//清除定时器
				logo.hide();//隐藏logo
				document.body.removeChild(loadingEle);
				
				//加载页面结束后，进行回调
				callback();
				return;
			}
			
			
				//切换背景图
				loadingEle.style.background = "url(" + loadImages[index%3] + ") no-repeat" ;
				index++;
		}, 500);
	},
	
	
	
	//鼠标移动(监听鼠标移动)
	mouseMove: function() {
		myPlane.ele.onmousedown = function(evt) {
			var oEvent = evt || event;
			this.disX = oEvent.clientX - this.offsetLeft;
			this.disY = oEvent.clientY  - this.offsetTop;
			document.onmousemove = function(evt){
				var oEvent = evt || event;
				
				myPlane.ele.style.left = oEvent.clientX - myPlane.ele.disX + "px";
				myPlane.ele.style.top = oEvent.clientY - myPlane.ele.disY + "px";
				
				//判断不超出边界
				if(myPlane.ele.offsetTop < gameEngine.ele.offsetTop) {
					myPlane.ele.style.top = gameEngine.ele.offsetTop + "px";
				}
			}
			document.onmouseup = function(){
				document.onmousemove= null;
				document.onmoueup = null;
			}
			
		}
	},
	//键盘监听(监听左右)
	keyListening: function() {
		var speed = 0; //移动速度
		//键盘按下
		document.onkeydown = function(evt) {
			var oEvent = evt || event;
			
			//左
			if(oEvent.keyCode == 37) {
				speed = -8; //表示会向左移动
			}
			//右
			else if (oEvent.keyCode == 39){
				speed = 8; //表示会向右移动
			}
		}
		//键盘松开
		document.onkeyup = function() {
			speed = 0; //不移动
		}
		
		setInterval(function(){
			//移动我的飞机
			myPlane.ele.style.left = myPlane.ele.offsetLeft + speed + "px";
			if (myPlane.ele.offsetLeft < gameEngine.ele.offsetLeft) {
			
				//如果超出了左边界，则最多移动到左边界位置
				myPlane.ele.style.left = gameEngine.ele.offsetLeft + "px";
			}
			else if(myPlane.ele.offsetLeft > gameEngine.ele.offsetLeft + gameEngine.ele.offsetWidth - myPlane.ele.offsetWidth) {
				myPlane.ele.style.left = gameEngine.ele.offsetLeft + gameEngine.ele.offsetWidth - myPlane.ele.offsetWidth + "px";
			}
			
		}, 30)
		
		
	},
	
	
	//创建敌机
	
	createEnemy: function() {
		//大飞机
		setInterval(function(){
			//一定几率创建敌机
			var flag = Math.random() > 0.8 ? true : false;
			if (flag) {
				var enemy = new Enemy(Enemy.prototype.PLANE_TYPE_LARGE);
				enemy.init().move();//敌机初始化并移动
			}
		}, 2000)
		
		setInterval(function(){
			//一定几率创建敌机
			var flag = Math.random() > 0.6 ? true : false;
			if (flag) {
				var enemy = new Enemy(Enemy.prototype.PLANE_TYPE_MIDDLE);
				enemy.init().move();//敌机初始化并移动
			}
		}, 700)
		
		setInterval(function(){
			//一定几率创建敌机
			var flag = Math.random() > 0.5 ? true : false;
			if (flag) {
				var enemy = new Enemy(Enemy.prototype.PLANE_TYPE_SMALL);
				enemy.init().move();//敌机初始化并移动
			}
		}, 500)
		
	},
	
	//碰撞检测
	
	crashListening: function() {
		var timer = setInterval(function() {
			//判断是否有子弹和敌机碰撞(交集)
			//console.log(gameEngine.bulletList);
			
			//遍历所有敌机
			for (var i in gameEngine.enemyList ) {
				//遍历所有子弹
				for(var j in gameEngine.bulletList) {
					
					if (gameEngine.bulletList[j] == undefined) {
						continue;
					}
					//判断子弹和敌机是否有交集
					if (isCrash(gameEngine.enemyList[i].ele, gameEngine.bulletList[j].ele)) {
						
						//如果有交集，说明发生了碰撞
						//子弹爆炸再消失
						gameEngine.bulletList[j].boom();
						
						//让敌机收到一点伤害
						gameEngine.enemyList[i].hurt();
						
						//删除bulletList中的这个子弹
						delete gameEngine.bulletList[j];
					}
				}
				
				//敌机和我的飞机是否有碰撞
				if (isCrash(gameEngine.enemyList[i].ele, myPlane.ele)) {
					
					
					if (confirm("GameOver, 是否继续?")) {
						clearInterval(timer);
						//我机爆炸
						myPlane.dieBoom();
						setTimeout(function(){
							window.location.reload();
						}, 1500);
						
					}
				}
			}
			
			
		}, 50)
	}
};

//log 
var logo = {
	ele: null,
	init: function() {
		this.ele = document.createElement("div");
		this.ele.className = "logo";
		return this;
	},
	show: function() {
		//显示logo
		document.body.appendChild(this.ele);
		return this;
	},
	
	//隐藏logo
	hide: function() {
		document.body.removeChild(this.ele);
	}
	
	
}
