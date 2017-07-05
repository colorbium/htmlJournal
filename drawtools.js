function setRed()
{
	var ctx = document.getElementById("page").getContext("2d");
	ctx.strokeStyle="#FF0000";
}
function setBlack()
{
	var ctx = document.getElementById("page").getContext("2d");
	ctx.strokeStyle="#000000";
}


function freeDraw()
{
  var cdiv = document.getElementById("page");
  var canvas = document.getElementsByClassName("selected")[0];
  cdiv.addEventListener("touchstart", start, false);
  cdiv.addEventListener("touchmove", move, false);
  function start()
  {
    area = canvas.getContext("2d");
    var x = event.touches[0].pageX;
	  var y = event.touches[0].pageY;	
    area.beginPath();
		area.moveTo(x, y);
  }
  function move()
  {
    area = canvas.getContext("2d");
    var x = event.touches[0].pageX;
	  var y = event.touches[0].pageY;	
    area.lineTo(x, y);
    area.stroke();
  }
 
  
}
