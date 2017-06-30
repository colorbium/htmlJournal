var filesystem = null;
var fileList = [];
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
			window.webkitRequestFileSystem(window.PERSISTENT, grantedSize, function(fs) {
				}, error);
			}, error);
	}
	else //filesystem exists
	{
		//get list of files
		getFiles();
		//display first file
		displayFile();
	}
}
function onInitFs(fs) {
	filesystem = fs;
	// Setup event listeners on the form.
	var canvas = document.getElementById("page");
	canvas.addEventListener("touchend", writeFile(), false);
}
//on next button click
	//display next file
//on prev button click
	//display previous file

/*modified from http://codepen.io/matt-west/pen/CrfKh?editors=1010 */
//get files
function getFiles() {
  var dirReader = filesystem.root.createReader();

  var fetchEntries = function() {
    dirReader.readEntries(function(results) {
      if (!results.length) {
      } else {
        fileList = fileList.concat(results);
        fetchEntries();
      }
    }, error('4'));
  };

 // fetchEntries();
}
/*end outside code */

//display file
function displayFile() {
	var fn = fileList[currimg];
  var fs = filesystem;
  fs.root.getFile(fn, {}, function(fileEntry) {

    // Get a File object representing the file,
    // then use FileReader to read its contents.com
    fileEntry.file(function(file) {
       var reader = new FileReader();

       reader.onloadend = function(e) {
         //var txtArea = document.createElement('textarea');
         var canvas = document.getElementById("page");
         canvas.value = this.result;
        // document.body.appendChild(txtArea);
       };

       reader.readAsDataURL(file);
    }, error);

  }, error);

}

//write file as image
//additional function to create directory and save as layers 
//for layer functionality
function writeFile() {
  var fs = filesystem;
  fs.root.getFile('a.png', {create: true, exclusive:false}, function(fileEntry) {

    // Create a FileWriter object for our FileEntry (log.txt).
    fileEntry.createWriter(function(fileWriter) {

      fileWriter.onwriteend = function(e) {
        console.log('Write completed.');
      };

      fileWriter.onerror = function(e) {
        console.log('Write failed: ' + e.toString());
      };

      // Create a new Blob and write it to log.txt.
      var canvas = document.getElementById("page");

      var blob = new Blob([canvas.toDataURL()], {type: 'image/jpg'});

      fileWriter.write(dataURItoBlob(canvas.toDataURL("image/png")));

    }, error('1'));

  }, error('2'));
}

function error(e) {

  console.log('Error: ' + e);
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
