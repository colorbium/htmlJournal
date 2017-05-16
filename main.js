function readFile(fs, fn) {
  fs.root.getFile(fn, {}, function(fileEntry) {

    // Get a File object representing the file,
    // then use FileReader to read its contents.
    fileEntry.file(function(file) {
       var reader = new FileReader();

       reader.onloadend = function(e) {
         var txtArea = document.createElement('textarea');
         txtArea.value = this.result;
         document.body.appendChild(txtArea);
       };

       reader.readAsText(file);
    }, error);

  }, error);

}
function writeFile(fs, fn) {

  fs.root.getFile(fn, {create: true}, function(fileEntry) {

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

      fileWriter.write(blob);

    }, error('error creating file'));

  }, error('error creating file'));
}

function onInitFs(fs) {
  console.log('File System Created')
  fs.root.getFile('log.txt', {create: true, exclusive: true}, function(fileEntry) {
  }, error('error creating file'));

}
function openFileSystem(){
  var canvas = document.getElementById("page");
  canvas.addEventListener("touchend", writeFile, false);
  window.webkitStorageInfo.requestQuota(PERSISTENT, 1024*1024, function(grantedBytes) {
  window.requestFileSystem(PERSISTENT, grantedBytes, onInitFs, error);
}, error);
//  window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
//  window.requestFileSystem(window.PERSISTENT, 5*1024*1024, onInitFs, error);
}

function error(e) {

  console.log('Error: ' + e);
}
