function setRed()
{
	var ctx = document.getElementsByClassName("selected")[0].getContext("2d");
	ctx.strokeStyle="#FF0000";
}
function setBlack()
{
	var ctx = document.getElementsByClassName("selected")[0].getContext("2d");
	ctx.strokeStyle="#000000";
}


function freeDraw()
{
  var cdiv = document.getElementById("page");
  cdiv.addEventListener("touchstart", start, false);
  cdiv.addEventListener("touchmove", move, false);
  function start()
  {
  var canvas = document.getElementsByClassName("selected")[0];
    area = canvas.getContext("2d");
    var x = event.touches[0].pageX;
	  var y = event.touches[0].pageY;	
    area.beginPath();
		area.moveTo(x, y);
  }
  function move()
  {
  var canvas = document.getElementsByClassName("selected")[0];
    area = canvas.getContext("2d");
    var x = event.touches[0].pageX;
	  var y = event.touches[0].pageY;	
    area.lineTo(x, y);
    area.stroke();
  }
 
  
}
