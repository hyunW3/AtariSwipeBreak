var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var info = document.getElementById("info").getContext("2d")

var x;
var y;
function init() {
	x = canvas.width/2;
	y = canvas.height-30;
	window.requestAnimationFrame(mouse);	
};
init();
var ballRadius = 8;
var level =1;

var cannonHeight = 20;
var cannonWidth = 10;
var cannonX = (canvas.width-cannonWidth)/2;

var mouseClick = false;
var brokenBrickN =0;
var ballcount =1;

// 벽돌만들기
var brickRowCount = 4;
var brickColumnCount = 6;
var brickWidth = 70;
var brickHeight = 20;
var brickPadding = 3;
var brickOffsetTop = 30;
var brickOffsetLeft = 20;
var bricks =[];
for (var c=0; c<brickColumnCount; c++){
	bricks[c] = [];
	for( var r=0; r<brickRowCount; r++){
		bricks[c][r] = {x:0, y:0, status: (Math.floor(Math.random()*level)+1)};
	}
}

function drawBricks() {
	for( var c=0; c<brickColumnCount; c++){
		for(var r=0; r<brickRowCount; r++){
			if(bricks[c][r].status > 0){
				var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
				var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
				bricks[c][r].x = brickX;
				bricks[c][r].y = brickY;
				ctx.beginPath();
				ctx.rect(brickX, brickY, brickWidth, brickHeight);
				ctx.fillStyle = "#0095FF";
				ctx.fill();
				ctx.closePath();
				ctx.beginPath();
				ctx.font = "12px Arial";
				ctx.fillStyle = "black";
				ctx.fillText(status,brickWidth/2,brickHeight/2);
			}
		}
	}
}
function showStage() {
	ctx.font = "16px Arial";
	ctx.fillStyle = "#0095DD";
	ctx.fillText("Stage: "+ ballcount, canvas.width-80,20);
}
// 충돌감지
function collisionDetection() {
	for(var c=0; c<brickColumnCount; c++){
		for(var r=0; r<brickRowCount; r++){
			var b = bricks[c][r];
			if(b.status == 1){
				if(x > b.x && x< b.x+brickWidth && y> b.y && y< b.y+brickHeight){
					dy = -dy;
					b.status--;
					brokenBrickN++;
					if(brokenBrickN == brickRowCount*brickColumnCount){
						alert("Next stage");
						ballcount++;
						init();
					}

				}
			}
		}
	}
}


function Dcannon() {
	ctx.beginPath();
	ctx.rect(cannonX, canvas.height-cannonHeight, cannonWidth, cannonHeight);
	ctx.fillStyle = "#0095DD";
	ctx.fill();
	var degree = Math.atan2(dx,dy)*(180/Math.PI);
	//ctx.rotate(degree*Math.PI/180);
	ctx.closePath();
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
		dy = clientY - (canvas.height-cannonHeight) - pos.ay;
		var square = Math.pow(dx,2)+Math.pow(dy,2);
		dx = (dx/Math.sqrt(square)).toFixed(2);
		dy = (dy/Math.sqrt(square)).toFixed(2);
		info.font = "16px Arial"
		info.fillText("dx is "+dx +" dy is "+dy,8,20);
		//window.requestAnimationFrame(diff);
		decision();
	};
	decision();

};
// rotate 
// http://www.williammalone.com/briefs/how-to-rotate-html5-canvas-around-center/
// https://webisora.com/blog/rotate-elements-using-javascript/
function draw(){
	ctx.clearRect(0,0, canvas.width, canvas.height-cannonHeight);
	drawBricks();
	Dball();
	Dcannon();
	showStage();
	//mouse();

	window.requestAnimationFrame(draw);
}
draw();



function shoot() {
	//Dball();
	x += dx*2;
	y += dy*2;
	collisionDetection();
	if( x+2*dx > canvas.width-ballRadius || x+2*dx < ballRadius){
		dx = -dx;
	} 
	else if( y+2*dy < ballRadius) {
		dy = -dy;
	} 
	if (!(y+2*dy > canvas.height -ballRadius)){
		window.requestAnimationFrame(shoot);
	} else{
		alert("died!");
		init();
		document.location.reload();
	}
	
	//var cv = document.getElementById("myCanvas");
	//var pos = elePos(cv);
}

document.addEventListener("click", function(){
	mouseClick = true;
	//window.cancelAnimationFrame(mouse);
	shoot();
});


// uncompleted
function f_info() {
	//mouse();
};