var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var info = document.getElementById("info").getContext("2d")

var x = canvas.width/2;
var y = canvas.height-30;
var ballRadius = 8;
var level =1;

var cannonHeight = 20;
var cannonWidth = 10;
var cannonX = (canvas.width-cannonWidth)/2;

var mouseClick = false;

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
//track the moust position
// https://www.w3schools.com/js/js_events_examples.asp
// https://gist.github.com/jcgregorio/3b9b06b38582e6e4c4ed
var dx;
var dy;
function mouse() {
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

}
// rotate 
// http://www.williammalone.com/briefs/how-to-rotate-html5-canvas-around-center/
// https://webisora.com/blog/rotate-elements-using-javascript/
var loop = function draw(){
	ctx.clearRect(cannonX,canvas.height-cannonHeight, cannonWidth, cannonHeight);
	Dball();
	Dcannon();
	mouse();
	window.requestAnimationFrame(loop);
}
loop();



function shoot() {
	//Dball();
	x += dx*2;
	y += dy*2;
	if( x+2*dx > canvas.width-ballRadius || x+2*dx < ballRadius){
		dx = -dx;
	} 
	else if(y+2*dy > canvas.height -ballRadius || y+2*dy < ballRadius) {
		dy = -dy;
	}
	window.requestAnimationFrame(shoot);
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