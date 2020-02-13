//-----------------------------------------------------------------------------
/*:

 */

function Tetris_Window(){
	this.initialize.apply(this, arguments);
}

Tetris_Window.prototype = Object.create(Window_Base.prototype);
Tetris_Window.prototype.constructor = Tetris_Window;

Tetris_Window.prototype.initialize = function(){
	Window_Base.prototype.initialize.call(this, 500, 0, 350, 600);
	this.refresh();
}

Tetris_Window.prototype.refresh = function(){
	this.contents.clear();

}

function Scene_Tetris(){
	this.initialize.apply(this, arguments);
}

Scene_Tetris.prototype = Object.create(Scene_MenuBase.prototype);
Scene_Tetris.prototype.constructor = Scene_Tetris;

Scene_Tetris.prototype.initialize = function(){
	Scene_ItemBase.prototype.initialize.call(this);
	this.initializeData();
}

Scene_Tetris.prototype.start = function(){
	Scene_Base.prototype.start.call(this);
	AudioManager.playSe(this.seBoom);
	this.startFadeIn(60, false);
	this.say(this.battleInfo.startMsg);
}

Scene_Tetris.prototype.createBackground = function(){
	this.backgroundSprite = new Sprite();
	this.backgroundSprite.bitmap = ImageManager.loadPicture("Translucent");
	this.addChild(this.backgroundSprite);
}

Scene_Tetris.prototype.initializeData = function(){
	this.ROW = 10;
	this.COL = 23;
	this.SCORE = 0;
	this.running = false;
	this.step = 10000;
	this.xrange = 25;
	this.yrange = 25;
	
	this.xposition = 530;
	this.yposition = 27;
	
	this.moved = false;
	
	this.seTick = {
		name: "Click",
		pan: 0,
		pitch: 50,
		volume: 150
	};
	this.seBoom = {
		name: "Boom",
		pan: 0,
		pitch: 50,
		volume: 150
	};
	
	this.battleInfo = battleList[$gameVariables.value(1)];
	
	this.game_area = new Array(this.COL);
	for(var i=0; i<this.game_area.length; i++){
		this.game_area[i] = new Array(this.ROW).fill(0);
	}
	
	this.data = {
		'o':[
			[
			[1, 1],
			[1, 1]
			]
		],
		's':[
			[
			[0, 0, 0],
			[0, 2, 2],
			[2, 2, 0]
			],
			[
			[2, 0, 0],
			[2, 2, 0],
			[0, 2, 0]
			]
		],
		'5':[
			[
			[0, 0, 0],
			[3, 3, 0],
			[0, 3, 3]
			],
			[
			[0, 3, 0],
			[3, 3, 0],
			[3, 0, 0]
			]
		],			
		'l':[
			[
			[0, 0, 0],
			[0, 0, 4],
			[4, 4, 4]
			],
			[
			[4, 0, 0],
			[4, 0, 0],
			[4, 4, 0]
			],
			[
			[0, 0, 0],
			[4, 4, 4],
			[4, 0, 0]
			],
			[
			[4, 4, 0],
			[0, 4, 0],
			[0, 4, 0]
			]
		],
		't':[
			[
			[0, 0, 0],
			[0, 5, 0],
			[5, 5, 5]
			],
			[
			[5, 0, 0],
			[5, 5, 0],
			[5, 0, 0]
			],
			[
			[0, 0, 0],
			[5, 5, 5],
			[0, 5, 0]
			],
			[
			[0, 5, 0],
			[5, 5, 0],
			[0, 5, 0]
			]
		],
		'j':[
			[
			[0, 0, 0],
			[6, 0, 0],
			[6, 6, 6]
			],
			[
			[6, 6, 0],
			[6, 0, 0],
			[6, 0, 0]
			],
			[
			[0, 0, 0],
			[6, 6, 6],
			[0, 0, 6]
			],
			[
			[0, 0, 6],
			[0, 0, 6],
			[0, 6, 6]
			]
			
		],
		'1':[
			[
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[7, 7, 7, 7]
			],
			[
			[7, 0, 0, 0],
			[7, 0, 0, 0],
			[7, 0, 0, 0],
			[7, 0, 0, 0]
			]
		]
	};
		
	this.cur = null;
	this.next = null;
	this.n = 0;
	this.refreshTime = 0;
	this.gaugeSCORE = 0;
	this.enemyHP = this.battleInfo.hp;
	this.hit = new Sprite_Animation();
	
}

Scene_Tetris.prototype.drawArea = function(){
	this.refreshWindow();
	
	for(i in this.game_area){
		for(j in this.game_area[i]){
			if(this.game_area[i][j] != 0){
				var blackBlock = new Sprite();
				blackBlock.bitmap = ImageManager.loadPicture("block");
				blackBlock.x = j*(Graphics.boxWidth/32)+6;
				blackBlock.y = (i-1)*(Graphics.boxHeight/25)+5;
				this.Main_Window.addChild(blackBlock);
			}
		}
	}
}

Scene_Tetris.prototype.update = function(){
	Scene_MenuBase.prototype.update.call(this);
	// this.debug_window.contents.clear();
	// this.string = "";
	// for (i in this.game_area){
		// for (j in this.game_area[i]){
			// this.string += (String(this.game_area[i][j])+" ");
		// }
		// this.debug_window.drawText(this.string,0,i*22);
		// this.string = "";
	// }
	
	this.Score_Board.contents.clear();
	this.Score_Board.drawText("Score:"+this.SCORE, 0, 0);
	
	if (Input.isTriggered('ok')|| TouchInput.isPressed()) {
		if(this.gameover){
			this.startFadeIn(60, false);
			SceneManager.pop(Scene_Tetris);
		}else{
			if(!this.running){
				this.say(this.battleInfo.playMsg)
				AudioManager.playSe(this.seTick);
				this.oldTime = Date.now();
			}
			this.SCORE = 0;
			this.refreshWindow();
			this.running = true;
		}
	}
	
	if (Input.isTriggered('right')){
		if(this.running && this.bMove(this.cur, 1)){
			this.cur.block.x += this.xrange;
		}
	}
	
	if (Input.isTriggered('left')){
		if(this.running && this.bMove(this.cur, -1)){
			this.cur.block.x -= this.xrange;
		}
	}
	
	if (Input.isTriggered('up')){
		if (this.running && this.bRotate(this.cur)){
			this.rotateBox();
		}
	}
	
	// if (Input.isTriggered('escape')){
		// this.gaugeSCORE ++;
		// this.refreshWindow();
	// }
	
	if (Input.isPressed('down')){
		this.step = 250;
	}else{
		this.step = 10000;
	}
	
	if (this.running){
		
		if(this.cur.block.y < 0){
			this.say(this.battleInfo.defeatMsg)
			AudioManager.playSe(this.seBoom);
			this.running = false;
			this.gameover = true;
			this.enemy.bitmap = ImageManager.loadPicture(this.battleInfo.enemyPic+ "_laugh");
			$gameSwitches.setValue(20, false);
		}
		
		// if(this.SCORE == this.battleInfo.targetScore){
			// this.say(this.battleInfo.winMsg);
			// AudioManager.playSe(this.seBoom);
			// this.enemy.bitmap = ImageManager.loadPicture(this.battleInfo.enemyPic+ "_defeated");
			// this.say(this.battleInfo.winMsg);
			// this.running = false;
			// this.gameover = true;
			// $gameSwitches.setValue(20, true);
		// }
		
		if(this.gaugeSCORE >= this.battleInfo.targetScore){
			AudioManager.playSe(this.seBoom);
			this.enemy.bitmap = ImageManager.loadPicture(this.battleInfo.enemyPic+ "_defeated");
			this.enemyHP -=(10+(this.gaugeSCORE-this.battleInfo.targetScore));
			this.gaugeSCORE = 0;
			// this.hit.remove();
		}
		
		this.Enemy_Board.contents.clear();
		this.Enemy_Board.drawVerticalGauge(10, 25, 20, 300,this.enemyHP/this.battleInfo.hp, this.Enemy_Board.hpGaugeColor1(), this.Enemy_Board.hpGaugeColor2());
		this.Enemy_Board.drawText(this.enemyHP, 5*("100".length - (this.enemyHP+"").length), 150);
		
		if(this.enemyHP<=0){
			this.say(this.battleInfo.winMsg);
			AudioManager.playSe(this.seBoom);
			this.enemy.bitmap = ImageManager.loadPicture(this.battleInfo.enemyPic+ "_defeated");
			this.say(this.battleInfo.winMsg);
			this.running = false;
			this.gameover = true;
			$gameSwitches.setValue(20, true);
		}
		
		if(this.collide(this.cur)){
			this.mergeBox();
			this.removeChild(this.cur.block);
			this.cur = null;
			this.drawArea();
			this.createBox();
		}
		
		this.n+=Date.now()-this.oldTime;	
		
		if(this.n>=this.step){
			if(this.enemy.bitmap == ImageManager.loadPicture(this.battleInfo.enemyPic+ "_defeated")){
				this.enemy.bitmap = ImageManager.loadPicture(this.battleInfo.enemyPic+ "_normal");
			}
			
			if(!this.moved){
				this.moved = true;
				this.Enemy_Board.removeChild(this.enemy);
				this.enemy.x += 5;
				this.enemy.y -= 5;
				this.Enemy_Board.addChild(this.enemy);
			}else{
				this.moved = false;
				this.Enemy_Board.removeChild(this.enemy);
				this.enemy.x = 125;
				this.enemy.y = 55;
				this.Enemy_Board.addChild(this.enemy);
			}
			this.n = 0;
			this.oldTime = Date.now();
			this.removeChild(this.cur.block);
			this.cur.block.y += this.yrange;
			this.addChild(this.cur.block);
			this.refreshTime++;
		}
		
		if (this.refreshTime>=20){
			var rnd = Math.floor(Math.random()*(this.battleInfo.rndMsg.length-1));
			this.say(this.battleInfo.rndMsg[rnd]);
			this.refreshTime = 0;
		}
		
	}
}
	
Scene_Tetris.prototype.mergeBox = function(){
	
	AudioManager.playSe(this.seTick);
	var len = this.cur.box.length;
	var y = Math.floor((this.cur.block.y-this.yposition)/this.yrange);
	var x = Math.floor((this.cur.block.x-this.xposition)/this.xrange);
	for(var i=0; i<len; i++){
		if(i+y>=0){
			for(var j=0; j<this.cur.box[i].length; j++){
				if(this.cur.box[i][j] !==0 && this.game_area[i+y] && this.game_area[i+y][j+x] == 0){
					this.game_area[i+y][j+x] = this.cur.box[i][j];
				}
			}	
		}
	}		

	var arr = this.isRemove();
	
	if(arr){
		if(arr[0]){
			AudioManager.playSe(this.seBoom);
			this.say(this.battleInfo.mergeMsg);
		}
		for(var i=0; i<arr.length; i++){
			this.game_area.splice(arr[i], 1);
			this.game_area.unshift(new Array(this.ROW).fill(0));
		}
		this.SCORE+=Math.pow(3, arr.length);
		this.gaugeSCORE += Math.pow(3, arr.length);
	};
}
	
Scene_Tetris.prototype.isRemove = function(){
	var arr = [];
	for(var i=0; i<this.game_area.length; i++){
		var remove = true;
		for(var j=0; j<this.game_area[i].length; j++){
			if(this.game_area[i][j] == 0){
				remove = false;
			}
		}
		if(remove){
			arr.push(i);
		}
	}
	return arr;
}
	
Scene_Tetris.prototype.collide = function(cur){
	var box = this.cur.box;
	var len = this.cur.box.length;
	var x = Math.floor((this.cur.block.x-this.xposition)/this.xrange);
	var y = Math.floor((this.cur.block.y-this.yposition)/this.yrange)+1;
	
	for(var i=0; i<len; i++){
		if(i+y>=0){
			for(var j=0; j<len; j++){
				if(box[i][j] !== 0){

					if(i+y>=this.game_area.length || (i+y<this.game_area.length && this.game_area[i+y][j+x] !== 0)){
						return true;
					}
				}
			}
		}
	}		
	return false;
}

Scene_Tetris.prototype.createBox = function(){
	
	if(!this.next){
		var rnd = Math.floor(Math.random()*7);
		this.next = {
			block: new Sprite(),
			type: this.block_pics[rnd],
			rotation: 0,
			box: this.data[this.block_pics[rnd]][0]
			
		};
		
		this.next.block.bitmap = ImageManager.loadPicture(this.block_pics[rnd]);
		this.next.block.x = this.xposition+(this.ROW*this.yrange)/3;
		this.next.block.y = this.yposition;
	}
	
	if(!this.cur){
		this.cur = this.next;
		var rnd = Math.floor(Math.random()*7);
		this.next = {
			block: new Sprite(),
			type: this.block_pics[rnd],
			rotation: 0,
			box: this.data[this.block_pics[rnd]][0]
		}
		
		this.next.block.bitmap = ImageManager.loadPicture(this.block_pics[rnd]);
		this.next.block.x = this.xposition+(this.ROW*this.yrange)/3;
		this.next.block.y = this.yposition;
		
		while(this.collide(this.cur)){
			this.cur.block.y -=1;
		}
		this.addChild(this.cur.block);
	}
	
}

Scene_Tetris.prototype.bRotate = function(cur){
	var type = cur.type;
	var rotation = cur.rotation;
	var box = null;
	
	if(rotation + 1 <= this.data[type].length-1){
		box = this.data[type][rotation+1];
	}else{
		box = this.data[type][0];
	}
	if(box){
		var len = box.length;
	}else{
		return false;
	}
	var x = Math.floor((this.cur.block.x-this.xposition)/this.xrange);
	var y = Math.floor((this.cur.block.y-this.yposition)/this.yrange)+1;
	
	for(var i=0; i<len; i++){
		if(i+y>=0){
			for(var j=0; j<len; j++){
				if(box[i][j] !== 0){
					if(j+x<0 || j+x==this.game_area[0].length || (j+x>=0 && this.game_area[i+y] && this.game_area[i+y][j+x]!==0)){
						return false;
					}
				}
			}
		}
	}		
	return true;
} 

Scene_Tetris.prototype.bMove = function(cur, n){
	var x = Math.floor((this.cur.block.x-this.xposition)/this.xrange)+n;
	var y = Math.floor((this.cur.block.y-this.yposition)/this.yrange);
	for(var i=0; i<cur.box.length; i++){
		for(var j=0; j<cur.box[i].length; j++){
			if(cur.box[i][j]!==0){
				if(j+x<0 || j+x==this.game_area[0].length || ( i+y>=0 && j+x>=0 && this.game_area[i+y] && this.game_area[i+y][j+x]!==0)){
					return false;
				}
			}
		}
	}
	return true;
}

Scene_Tetris.prototype.rotateBox = function(){
	var type = this.cur.type;
	var rotation = this.cur.rotation;
	
	if(rotation + 1 <= this.data[type].length-1){
		this.cur.box = this.data[type][rotation+1];
		this.removeChild(this.cur.block);
		this.cur.block.bitmap = ImageManager.loadPicture(type + (rotation+1))
		this.cur.rotation++;
		this.addChild(this.cur.block);
	}else{
		this.cur.box = this.data[type][0];
		this.removeChild(this.cur.block);
		this.cur.block.bitmap = ImageManager.loadPicture(type);
		this.cur.rotation = 0;
		this.addChild(this.cur.block);
	}
	
	
}

Scene_Tetris.prototype.create = function(){
	Scene_ItemBase.prototype.create.call(this);
	this.block_pics = ["1", "5", "j", "l", "o", "s", "t"];
	
	this.Enemy_Board = new Tetris_Window();
	this.Enemy_Board.move(10, 25, 510, 380);
	this.Enemy_Board.removeChildAt(0);
	this.Enemy_Board.drawVerticalGauge(10, 25, 20, 300, this.enemyHP/this.battleInfo.hp, this.Enemy_Board.hpGaugeColor1(), this.Enemy_Board.hpGaugeColor2());
	this.Enemy_Board.drawText(this.enemyHP, 5*("100".length - (this.enemyHP+"").length), 150);
	
	this.enemy = new Sprite();
	this.enemy.bitmap = ImageManager.loadPicture(this.battleInfo.enemyPic+ "_normal");
	this.enemy.x = 125;
	this.enemy.y = 55;
	this.Enemy_Board.addChild(this.enemy);
	
	
	//this.debug_window = new Tetris_Window();
	
	this.Score_Board = new Tetris_Window();
	this.Score_Board.move(320, 25, Graphics.boxWidth*1/4, 80)
	
	this.Target_Score_Board = new Tetris_Window();
	this.Target_Score_Board.move(320, 110, Graphics.boxWidth*1/4, 80)
	this.Target_Score_Board.drawText("目标分数："+this.battleInfo.targetScore, 0,0)
	
	// this.Instruction_Board = new Tetris_Window();
	// this.Instruction_Board.move(310, 130, Graphics.boxWidth*1/4+70, 200);
	// this.Instruction_Board.drawText("z: 开始游戏",0,0)
	// this.Instruction_Board.drawText("↑: 旋转方块",0,30);
	// this.Instruction_Board.drawText("←→: 移动方块",0,60);
	// this.Instruction_Board.drawText("↓: 加速",0,90);
	// this.Instruction_Board.drawText("x: 退出",0,120)
	
	this.msgBoard = new Tetris_Window();
	this.msgBoard.move(10, 400, 510, 200);
	
	this.Main_Window = new Tetris_Window();
	this.Main_Window.move(this.xposition, this.yposition-5, this.ROW*this.xrange+50, this.COL*this.yrange);
	this.Main_Window.drawVerticalGauge(this.ROW*this.xrange, 0, 10, this.COL*this.yrange, this.gaugeSCORE/this.battleInfo.targetScore, this.Main_Window.hpGaugeColor1(), this.Main_Window.hpGaugeColor1());
	
	//this.addWindow(this.debug_window);
	this.addWindow(this.Enemy_Board);
	this.addWindow(this.Main_Window);
	this.addWindow(this.Score_Board);
	this.addWindow(this.Target_Score_Board);
	// this.addWindow(this.Instruction_Board);
	this.addWindow(this.msgBoard);
	
	this.createBox();
	
}

Scene_Tetris.prototype.say = function(arr){
	this.msgBoard.contents.clear();
	for(i in arr){
		this.msgBoard.drawText(arr[i], 0, i*25);
	}
}

Scene_Tetris.prototype.refreshWindow = function(){
	this.removeChild(this.Main_Window);
	this.Main_Window = new Tetris_Window();
	this.Main_Window.move(this.xposition, this.yposition-5, this.ROW*this.xrange+50, this.COL*this.yrange);
	this.Main_Window.drawVerticalGauge(this.ROW*this.xrange, 0, 10, this.COL*this.yrange, this.gaugeSCORE/this.battleInfo.targetScore, this.Main_Window.hpGaugeColor1(), this.Main_Window.hpGaugeColor1());
	this.addWindow(this.Main_Window);
}

function tetris_start(){
	SceneManager.push(Scene_Tetris);
}

