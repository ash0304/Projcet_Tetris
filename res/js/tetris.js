//取得 Canvas區域Id 
const canvas = document.getElementById('tetris');
// 取得2d繪圖引擎
const context = canvas.getContext("2d");

const canvasP = document.getElementById('preview');

const ctx = canvasP.getContext("2d");

const arena = createMatrix(12,20); //width :12 height: 20

let isPause =false;

document.getElementById("bgAudio").volume = 0.3;

const player = {
	pos:{x : 0, y : 0},
	matrix : null,
	score : 0,
	nextMatrix : null,
}

const colors = [
	null,
	'#FF0D72',
	'#0DC2FF',
	'#0DFF72',
	'#F538FF',
	'#FF8E0D',
	'#FFE138',
	'#3877FF',
];

// 將玩家的矩陣資訊合併到遊戲區域
function merge(arena , player){
	player.matrix.forEach(function(row,y){
		row.forEach(function(value,x){
			if(value !== 0){
				arena[y + player.pos.y][x + player.pos.x] = value;
			}
		});
	});
}

// 碰撞判定

function collide(arena , player) {
	const [m,o] =[player.matrix,player.pos];
	// 透過兩層for迴圈抓出形狀陣列
	for (let y = 0; y < m.length; y++){
		for (let x = 0; x < m[y].length;x++){
			if (m[y][x] !== 0 &&
				(arena[y + o.y] && arena[y + o.y][x + o.x])!==0){
				return true;
			}
		}
	}
	return false;
}

function arenaSweep(){
	// 計算分數用
	let rowCount = 1;
	// 使用Label方法
	outer:
		for ( let y = arena.length - 1; y > 0 ; y--){
			for (let x = 0 ; x < arena[y].length ; x++){
				if (arena[y][x] === 0){
					continue outer;
				}
			}
			// 當不等於0時 , 將填滿的行消除 ,填滿0 ,移動到最上層
			//將arena陣列至y時 , 擷取1數組後,利用[0]呼叫修改後的原陣列 , 馬上將陣列填滿0  
			const row = arena.splice(y,1)[0].fill(0);
			// unshift() 將元素加到陣列最前面 , 利用此法將填滿0的空白行增加到最上面
			arena.unshift(row);
			// 因為移走一行 , 所以y需要遞增來抵銷
			y++;
			
			player.score += rowCount *10;
		 
		}
}


// 建立arena

function createMatrix(w,h){
	const matrix = [];
	while (h--){
		matrix.push(new Array(w).fill(0));
	}
	return matrix;
}

//方塊形狀參考

function createPiece(type){
	 if (type === 'T') {
	 	return [
	 		[0, 0, 0],
			[1, 1, 1],
			[0, 1, 0],
	 	];
	 }else if (type === 'O'){
	 	return [
	 		[2, 2],
	 		[2, 2],
	 	];
	 }else if (type === 'L'){
	 	return [
	 		[0, 3, 0],
	 		[0, 3, 0],
	 		[0, 3, 3],
	 	];
	 }else if (type === 'J'){
	 	return [
	 		[0, 4, 0],
	 		[0, 4, 0],
	 		[4, 4, 0],
	 	];
	 }else if (type === 'I'){
	 	return [
	 		[0, 0, 5, 0, 0],
	 		[0, 0, 5, 0, 0],
	 		[0, 0, 5, 0, 0],
	 		[0, 0, 5, 0, 0],
	 	];
	 }else if (type === 'S'){
	 	return [
	 		[0, 6, 6],
	 		[6, 6, 0],
	 		[0, 0, 0],
	 		
	 	];
	 }else if (type === 'Z'){
	 	return [
	 		[7, 7, 0],
	 		[0, 7, 7],
	 		[0, 0, 0],
	 		
	 	];
	 }
}

// // origin
// 			[0, 4, 0],
// 	 		[0, 4, 0],
// 	 		[4, 4, 0],
// // transpose
// 			[0, 0, 4],
// 	 		[4, 4, 4],
// 	 		[0, 0, 0],
// // reverse(matrix);
// 			[0, 0, 0],
// 	 		[4, 4, 4],
// 	 		[0, 0, 4],
// // reverse(row);
// 			[4, 0, 0],
// 	 		[4, 4, 4],
// 	 		[0, 0, 0],


// 繪製場景
function draw(){
	// 繪製遊戲區域
	context.fillStyle ="rgb(0,0,0)"
	//fillRect(x座標,y座標,寬,高)
	context.fillRect(0,0,canvas.width,canvas.height);
	
	drawMatrix(arena , {x : 0 , y: 0});

	drawMatrix(player.matrix, player.pos );
	
}


// 繪製方塊 設定offset提供微調位置
function drawMatrix(matrix,offset){
	//row = matrix內的一組數據 , y = 排序 第一組為0 
	matrix.forEach(function(row,y){
		// value = row內的數據  , x = 排序
		row.forEach(function(value,x){
			//判斷式 , 若value = 0 代表方塊不需要畫上去
			if(value !== 0){
				context.fillStyle =colors[value];
				context.fillRect((x + offset.x)*20,
								 (y + offset.y)*20,
								 19,19);
			}
		});
	});
}

// 繪製下一個方塊預覽 設定offset提供微調位置

function drawPreview(matrix,offset){
	//row = matrix內的一組數據 , y = 排序 第一組為0 
	matrix.forEach(function(row,y){
		// value = row內的數據  , x = 排序
		row.forEach(function(value,x){
			//判斷式 , 若value = 0 代表方塊不需要畫上去
			if(value !== 0){
				ctx.fillStyle =colors[value];
				ctx.fillRect((x + offset.x)*20-50,
								 (y + offset.y)*20+40,
								 19,19);
			}
		});
	});
}

// 方塊落下
function playerDrop(){
	player.pos.y++; // 掉一格
	// 碰撞判定
	if (collide(arena ,player)){
		player.pos.y --;
		merge(arena , player);
		playerReset();
		arenaSweep();
		updateScore();
		
	}
	dropCounter = 0;   // 重置計算器
}

// 玩家操控左右方向
function playerMove(dir){
	player.pos.x += dir; 
	if(collide(arena,player)){
		player.pos.x -= dir;
	}
}




// 預先取得生產方塊的隨機結果	
	 
const nextPieces = 'TJLOSZI';
	
player.nextMatrix = createPiece(nextPieces[Math.floor(Math.random()*nextPieces.length)]);

	
// 重置遊戲

function playerReset(){
	const nextPieces = 'TJLOSZI';
	player.matrix = player.nextMatrix;
	player.nextMatrix =createPiece(nextPieces[Math.floor(Math.random()*nextPieces.length)]);
	
	player.pos.y = 0;
	player.pos.x = (arena[0].length/2|0) -(player.matrix[0].length/2|0);

	ctx.fillStyle ='#000'; 
	//fillRect(x座標,y座標,寬,高)
	ctx.fillRect(0,0,canvas.width,canvas.height);
	drawPreview(player.nextMatrix, player.pos );
	
	
	if(collide(arena ,player)){
		arena.forEach(function(row){
			row.fill(0);
		})
		// 輸了之後, 分數歸零
		player.score = 0;
		updateScore();
	}
}

// 旋轉-陣列變形
function rotate(matrix , dir){
	for (let y = 0 ; y < matrix.length ; y ++){
		for (let x = 0 ; x < y; x ++){
			var temp = matrix[y][x];
			matrix[y][x] = matrix[x][y];
			matrix[x][y] =temp;
		}
	}

	if (dir > 0){
		matrix.forEach(function(row){
			row.reverse();
		});
	}else {
		matrix.reverse();
	}
}


// 旋轉功能

function playerRotate(dir){
	const pos = player.pos.x;
	let offset =1 ;
	rotate(player.matrix ,dir);
	while(collide(arena,player)){
		player.pos.x += offset;
		offset = -(offset + (offset >0 ?1:-1))
		if ( offset > player.matrix[0].length){
			rotate(player.matrix,-dir);
			player.pos.x = pos;
			return;
		}
	}
}


// 假設一秒為60幀，代表在Update方法中會執行60次
// 其1幀時間為0.016秒, 得到 deltaTime 
// 取得時間的變化量後 , 可達成控制速度的效果

const DROP_FAST = 0.5;
const DROP_SLOW = 1000;
let dropCounter = 0;
let dropInterval = DROP_SLOW; 
let lastTime = 0;

// 畫面更新
function update(time = 0){
	const deltaTime = time - lastTime;
	// console.log(deltaTime);
	lastTime = time;
	
	// 方塊自動落下動作
	dropCounter += deltaTime;
	if(dropCounter > dropInterval){
		playerDrop();
	};
	
	draw();
	
	 animate =requestAnimationFrame(update);
}


// 分數更新

function updateScore(){
	document.getElementById('score').innerText = player.score;
}

// 鍵盤事件

const keyListener = function(event){

	if (event.type ==='keydown'){
		if (event.keyCode === 37 ){
		playerMove(-1);		
		}else if (event.keyCode === 39){
			playerMove(1);
		}else if (event.keyCode === 40){
			playerDrop();		
		}else if (event.keyCode === 38){
			playerRotate(-1);
		}
	}


	if (event.keyCode === 81){
		if(event.type === 'keydown'){
		
			dropInterval = DROP_FAST;
			
		}else if (event.type ==='keyup'){
			
			dropInterval = DROP_SLOW;
		}
		
	}
}
document.addEventListener('keydown',keyListener);
document.addEventListener('keyup',keyListener);

// 重新開始
function restart(){
		playerReset();
		arena.forEach(function(row){
			row.fill(0);
		})
		player.score = 0;
		updateScore();
		
}
// 暫停
function pause(){
	
	if (!isPause){
		window.cancelAnimationFrame(animate);
		isPause = true;
	}else{
		requestAnimationFrame(update);
		isPause = false;
	}
}



playerReset();
updateScore();
update();




