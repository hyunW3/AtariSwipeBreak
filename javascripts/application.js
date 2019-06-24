//  cd ~/Desktop/Project/WEB/벽돌깨기\ 심화/ && git add * 
// 190613 unsolved problem : 
/* 1. 공여러개 만들기 
		 

	5. 초록색 먹으면 공개수 하나씩 증가시키기 
*/
/*	성공 내역
	벽돌 옆에 부딪혔을 때 dx 방향 전환하기 - 성공 190614
	닿은 위치에 공 위치시키기 -성공 190615
	다음 단계에 벽돌 한줄씩 내려오기 190616
	벽돌이 라인 넘어가면 게임 끝내기 --190617 다시 시작할때 첫번째 줄 status 값이 1 이상이 나온다
	가이드라인과 조금 다르게  발사가된다 190618 - 해결
	공 발사 가이드라인 만들기 -- 벽돌에 닿으면 없어져야되는데 실패했다.
*/
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var info = document.getElementById("info").getContext("2d")

var x;		
var y;
var level;
function init() {
	mouseClick = false;
	x = canvas.width/2;
	y = canvas.height-30;
	brickRowCount = 1;
	level =1;
	brickinit();
	window.cancelAnimationFrame(shoot);
	document.getElementById("myCanvas").addEventListener("onmouseover", mouse());
};
init();

var ballRadius = 8;

// 바닥 만들기

var lineHeight = 20;
function Dline() {
	ctx.beginPath();
	ctx.rect(0, canvas.height-lineHeight, canvas.width, 1);
	ctx.fillStyle = "#0095DD";
	ctx.fill();
	ctx.closePath();
}

var mouseClick = false;


// 벽돌만들기
var brickRowCount = 1;
var brickColumnCount = 6;
var brickWidth = 70;
var brickHeight = 30;
var brickPadding = 1;
var brickOffsetTop = 20;
var brickOffsetLeft = 20;
var bricks =[];
function brickinit() {
	bricks =[];
	for (var c=0; c<brickColumnCount; c++){
		bricks[c] = [];
		for( var r=0; r<brickRowCount; r++){
			var st = (Math.floor(Math.random()*(level+1)));
			bricks[c][r] = {x:0, y:0, status: st};
		}
	}	
	//drawBricks();
}
brickinit();


function drawBricks() {
	for( var c=0; c<brickColumnCount; c++){
		for(var r=0; r<brickRowCount; r++){
			var b = bricks[c][r];
			if(b.status > 0){
				var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
				var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
				b.x = brickX;
				b.y = brickY;
				ctx.beginPath();
				ctx.rect(brickX, brickY, brickWidth, brickHeight);
				ctx.fillStyle = "#0095FF";
				ctx.fill();
				//status number
				ctx.font = "12px Arial";
				ctx.fillStyle = "#ff0000";
				ctx.fillText(b.status, brickX+brickWidth/2, brickY+brickHeight/2+5);
				ctx.closePath();
			}
		}
	}
}
function showStage() {
	ctx.font = "16px Arial";
	ctx.fillStyle = "#0095DD";
	ctx.fillText("Stage: "+ level, canvas.width-80,20);
}
// 충돌감지
function collisionDetection() {
	for(var c=0; c<brickColumnCount; c++){
		for(var r=0; r<brickRowCount; r++){
			var b = bricks[c][r];
			if(b.status > 0){
				function exec() {
					b.status--;
				}

			if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight){
				if(x < b.x+ballRadius  ){
					dx = -dx;
				} else if(x > b.x+brickWidth-ballRadius  ){
					dx = -dx;
				} else if(y < b.y+ballRadius ) {
					dy = -dy;
				} else if(y > b.y+brickHeight-ballRadius ) {
					dy= -dy;
				} 
				exec();
			}

				
				
			}
		}
	}
}



function Dball() {
	ctx.beginPath();
	ctx.arc(x,y, ballRadius, 0, Math.PI*2);
	ctx.fillStyle = "#0095DD"
	ctx.fill();
	ctx.closePath();
}
//track the moust position
// https://www.w3schools.com/js/js_events_examples.asp
// https://gist.github.com/jcgregorio/3b9b06b38582e6e4c4ed
var dx;
var dy;
function mouse() {
	// Returns the position of the top left corner
     // of an element in DOM content coordinates.
    function elePos(ele) {
        var ax = ele.offsetLeft;
        var ay = ele.offsetTop;
        while (ele.offsetParent) {
          ele = ele.offsetParent;
          ax += ele.offsetLeft;
          ay += ele.offsetTop;
        }
      return {"ax": ax, "ay": ay};
  	};
	// The current mouse position in DOM content coordinates.
	var clientX = 0.0;
	var clientY = 0.0;
	var cv = document.getElementById("myCanvas");
	var pos = elePos(cv);
	// record the moust position when it moves
	cv.addEventListener('mousemove', function(e){
		clientX = e.clientX;
		clientY = e.clientY;
	});
	
	function decision() {
		if(!mouseClick){
			window.requestAnimationFrame(diff);

		} else {
			window.cancelAnimationFrame(diff);
		}
	}
	
	//Draw a rectangle at the mouse's last know position.
	function diff() {
		info.clearRect(0, 0, 180, 50);
		dx = clientX - x -pos.ax;
		dy = clientY - (canvas.height-lineHeight) - pos.ay;
		var square = Math.pow(dx,2)+Math.pow(dy,2);
		dx = (dx/Math.sqrt(square));
		dy = (dy/Math.sqrt(square));
		info.font = "16px Arial"
		info.fillText("dx is "+dx.toFixed(2) +" dy is "+Math.abs(dy.toFixed(2)),8,20);
		shootline(x,y,dx,dy);
		//window.requestAnimationFrame(diff);
		decision();
	};
	decision();
};
// rotate 
// http://www.williammalone.com/briefs/how-to-rotate-html5-canvas-around-center/
// https://webisora.com/blog/rotate-elements-using-javascript/
function shootline(x,y,dx,dy) {
		ctx.beginPath();
		ctx.moveTo(x+dx*ballRadius,y+dy*ballRadius);
		var kx = x;
		var ky = y;
		var flag = false;
		function check() {
			for(var c=0; c<brickColumnCount; c++){
				for(var r=0; r<brickRowCount; r++){
					var b = bricks[c][r];
					if(flag == true) break;
					if(b.status > 0){
						if(b.x < kx && kx <b.x+brickWidth && b.y < ky && b.y+brickHeight > ky){
							flag = true;
							
						}
					}
				}
			}
		}
		do {
			kx += dx*10;
			ky += dy*10;
			check();
			if(flag) break;
			//flag = true;
		} while(!(kx <0 || kx>canvas.width || ky <0 ));

		//var kx = x + dx*canvas.height;
		//var ky = y + dy*canvas.height;
		ctx.lineTo(kx,ky);
		ctx.stroke();
}
function draw(){
	setInterval( function() {
		ctx.clearRect(0,0, canvas.width, canvas.height); 
	}, 100);
	drawBricks();
	Dball();
	Dline();
	showStage();
	//mouse();

	window.requestAnimationFrame(draw);
}
draw();



function shoot() {
	//Dball();
if(mouseClick){
	x += dx*2;
	y += dy*2;
	collisionDetection();
	
	if( x+2*dx > canvas.width-ballRadius || x+2*dx < ballRadius){
		dx = -dx;
	} 
	else if( y+2*dy < ballRadius) {
		dy = -dy;
	} 
	
	if (!(y+2*dy > canvas.height -ballRadius-lineHeight)){
		window.requestAnimationFrame(shoot);
	} else{
		next();
	}
	/*
	if( x+2*dx > canvas.width-ballRadius || x+2*dx < ballRadius){
		dx = -dx;
	} 
	else if( y+2*dy < ballRadius || (y+2*dy > canvas.height -ballRadius-lineHeight)) {
		dy = -dy;
	} 
	window.requestAnimationFrame(shoot);
	*/
	//var cv = document.getElementById("myCanvas");
	//var pos = elePos(cv);
}
}

function next () {
	mouseClick = false;
	y = canvas.height-30;
	brickNext();
	level++;
	window.cancelAnimationFrame(shoot);
	mouse();
}

function brickNext() {
	brickRowCount++;
	for(var c=0; c<brickColumnCount; c++){
		for(var r=brickRowCount; r>=0; r--){
			if(r === 0){
				var st = Math.floor(Math.random()*(level+1));
				bricks[c][0] = {x:0, y:0, status: st};
			} else {
				var lr = r-1;
				/*
				bricks[c][r].x = bricks[c][lr].x;
				bricks[c][r].y = bricks[c][lr].y;
				bricks[c][r].status = bricks[c][lr].status;		
				*/
				bricks[c][r] = bricks[c][lr];		
			}

		}

	}
	var deci = 0;
	for(var c=0; c<brickColumnCount; c++){	
		deci += bricks[c][brickRowCount-1].status;
	}
	if(deci === 0){
		brickRowCount--;
	}
	if(brickRowCount >= 10){
		alert("The Game end!");
		init();
	}

}

document.getElementById("myCanvas").addEventListener("click", function(){
	mouseClick = true;
	//window.cancelAnimationFrame(mouse);
	shoot();
});


// uncompleted
function f_info() {
	//mouse();
};