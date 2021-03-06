var filesystem = null;
var currimg = 0;
//on init
function init()
{
	//if filesystem doesn't exist
	if(filesystem==null)
	{
		//request
		navigator.webkitPersistentStorage.requestQuota(1024 * 1024 * 5,
		function(grantedSize) {
			// Request a file system with the new size.
			window.webkitRequestFileSystem(window.PERSISTENT, grantedSize, function(fs) {onInitFs(fs);
				}, error);
			}, error);
	}
	else //filesystem exists
	{
//	filesystem=fs;
//	var canvas = document.getElementById("page");
//	canvas.addEventListener("touchend", writeFile(), false);
		//display first file
		displayFile();
	}
}
function onInitFs(fs) {
	filesystem = fs;
	// Setup event listeners on the form.
	var canvas = document.getElementById("page");
	var prev = document.getElementById("prev");
	var next = document.getElementById("next");
	canvas.addEventListener("touchend", function(){writeFile();}, false);
	prev.addEventListener("click", function(){goPrev();}, false);
	next.addEventListener("click", function(){goNext();}, false);
	displayFile();
}
//on next button click
	//display next file
function goNext(){
	
	//TODO-fix
	//clear all canvas elements, etc
	currimg=currimg+1;
	var canvas = document.getElementById("page");canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
	//check file exists
	filesystem.root.getFile('page' + (currimg).toString() + '.png', {create: false}, 
  function(fileEntry) {//file exists
		displayFile();}, 
  function(){//doesn't exist
	newFile();displayFile();
	});
	
	

}
//on prev button click
	//display previous file
function goPrev(){
	if(currimg>0)
	{
		var canvas = document.getElementById("page");canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
		currimg=currimg-1;
		displayFile();
	}
}


//display file
function displayFile() {
	
	//TODO fix
	//open layers.txt
	var fs = filesystem;
	var currDir = "page" + currimg.toString();
	fs.root.getDirectory(currDir, {create:false}, function(dirEntry){
		fs.root.getFile('page' + currimg.toString() + '/layers.txt', {create:false}, 
			function(fileEntry)
			{//file exists
				fileEntry.file(function(file){
					var reader = new FileReader();
					reader.onloadend = function(e){
						//this.results
						var text = e.target.result;
						var lines = text.split(/[\r\n]+/g);
						if(lines.length==1 && lines[0]=="")
						{
							newLayer();
						}
						else
						{
							currLayer = lines.length;
							//for each line
							for(i = 0; i<lines.length; i++)
							{
								newLayer(lines[i]);
								//find canvas
								var canvas = document.getElementById(lines[i]);
								//display img
								var drawing = new Image();
								drawing.src = "filesystem:"+window.location.origin +"/persistent/page" + currimg.toString()  + "/" + canvas.id + '.png'; // can also be a remote URL e.g. http://
								drawing.onload = function() {
								canvas.getContext("2d").drawImage(drawing,0,0);};
						}
					} 
				};
				reader.readAsText(file, "UTF-8");	
			});
			
			}, function(fileEntry){newFile();});
		}, 
			    function(dirEntry){newFile();});//end get Dir
}

//write file as image
//additional function to create directory and save as layers 
//for layer functionality
function newFile() {
  var fs = filesystem;
  var currDir = "page" + currimg.toString();
  fs.root.getDirectory('page' + currimg.toString(), {create:true}, function(dirEntry){
//  newLayer('page' + currimg.toString());
fs.root.getFile(currDir+ '/layers.txt', {create:true,exclusive:true}, function(fileEntry)
		{
				fileEntry.createWriter(function(fileWriter){
					},error);
			},//end success callback
		error);
		},error);
}
function addLayertoList(currLayer){
			var list = document.getElementById('layerlist');
			var li = document.createElement('li');
			li.id=currLayer.toString();
			list.appendChild(li);
			li.innerHTML="Layer " + currLayer.toString();
			var i = document.createElement('i');
			i.className="js-remove";
			i.innerHTML="X";
			li.appendChild(i);
}
function updateLog(){
var fs = filesystem;
	var currDir ='page' + currimg.toString() 
	fs.root.getDirectory(currDir, {create:false}, function(dirEntry){
		fs.root.getFile(currDir+ '/layers.txt', {create:false}, function(fileEntry)
		{//file exists
			fileEntry.createWriter(function(fileWriter){
			var list = document.getElementById("layers").getElementsByTagName("li");
				for(i = list.length-1; i>=0; i--)
				{
					var num = list[i].id;
					var canvas = document.getElementById("canvas" + num.toString());
					canvas.style.zIndex= i;
				
						var blob = new Blob([canvas.innerHTML], {type:'text/plain'});
					}
					},error);

		}); //end get file
  }, error); //end get Dir
}
function newLayer(layerName)
{
	var currDir = "page" + currimg.toString();
	var fs = filesystem;
	//new element in list
	//new canvas element
	//update z-indexes
	//update layers.txt
	var currLayer=1;
	fs.root.getDirectory(currDir, {create:false}, function(dirEntry){
		fs.root.getFile('page' + currimg.toString() + '/layers.txt', {create:false},
		function(fileEntry)
		{//file exists
			fileEntry.file(function(file){
				var reader = new FileReader();
				reader.onloadend = function(e){
					//this.results
					var text = e.target.result;
					var lines = text.split(/[\r\n]+/g);
					currLayer = lines.length; 
					if (layerName==null)
					{
						layerName = 'canvas' + currLayer.toString();
					}
					addLayertoList(layerName);
					fileEntry.createWriter(function(fileWriter){
						fileWriter.seek(fileWriter.length);
						var blob = new Blob([ layerName+'\n'], {type:'text/plain'});
						fileWriter.write(blob);
					},error);
				};
			reader.readAsText(file, "UTF-8");
			}, error);
		},error);//end get file
  }, error); //end get Dir
  //new element in list
 
	//new canvas element
  var newc = document.createElement("canvas");
  newc.id = "canvas" + currLayer.toString();
  newc.className="selected";
	//update z-indexes
  var z = 0;
  var not = document.getElementsByClassName("not");
  var i;
  for (i=0; i <not.length; i++){
	if(not[i].style.zIndex> z)
		{
			z = not[i].style.zIndex;
		}
  }
  var slt = document.getElementsByClassName("selected");
  for (i=0; i <slt.length; i++){
	
	if(slt[i].style.zIndex > z)
	{
		z = slt[i].style.zIndex;
	}
	  slt[i].className = "not";
  }
newc.style.zIndex = z+1;
var cdiv = document.getElementById("page");
cdiv.appendChild(newc);
updateLog();
}
function error(e) {

  console.log('Error: ' + e);
}
function writeFile() {
  var fs = filesystem;
	var canvas = document.getElementsByClassName("selected")[0];
  fs.root.getFile('page' + currimg.toString()  + "/" + canvas.id + '.png', {create: true, exclusive:false}, function(fileEntry) {

    // Create a FileWriter object for our FileEntry (log.txt).
    fileEntry.createWriter(function(fileWriter) {

      fileWriter.onwriteend = function(e) {
        console.log('Write completed.');
      };

      fileWriter.onerror = function(e) {
        console.log('Write failed: ' + e.toString());
      };

      // Create a new Blob and write it to log.txt.
     // var canvas = document.getElementById("page");
	  
      var blob = new Blob([canvas.toDataURL()], {type: 'image/jpg'});

      fileWriter.write(dataURItoBlob(canvas.toDataURL("image/png")));

    }, error('1'));

  }, error('2'));
}
//helper to make blob
function dataURItoBlob(dataURI, callback){
    var byteString = atob(dataURI.split(',')[1]);
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i =0; i<byteString.length;i++)
    {
	ia[i] = byteString.charCodeAt(i);
    }
    var blob = new Blob([ab]);
    return blob;
};
