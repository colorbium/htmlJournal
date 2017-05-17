var filesystem = null;
var fileList = null;
function readFile(fs, fn) {
  fs.root.getFile(fn, {}, function(fileEntry) {

    // Get a File object representing the file,
    // then use FileReader to read its contents.
    fileEntry.file(function(file) {
       var reader = new FileReader();

       reader.onloadend = function(e) {
         //var txtArea = document.createElement('textarea');
         var canvas = document.getElementById("canvas");
         canvas.value = this.result;
        // document.body.appendChild(txtArea);
       };

       reader.readAsDataURL(file);
    }, error);

  }, error);

}
function writeFile(fs) {

  fs.root.getFile('a.jpg', {create: true}, function(fileEntry) {

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
/*source: http://blog.teamtreehouse.com/building-an-html5-text-editor-with-the-filesystem-apis */
  fileList = document.getElementById("file-list");
  navigator.webkitPersistentStorage.requestQuota(1024 * 1024 * 5,
    function(grantedSize) {

      // Request a file system with the new size.
      window.webkitRequestFileSystem(window.PERSISTENT, grantedSize, function(fs) {

        // Set the filesystem variable.
        filesystem = fs;

        // Setup event listeners on the form.
        var canvas = document.getElementById("page");
        canvas.addEventListener("touchend", writeFile(filesystem), false);

        listFiles();
      }, error);

    }, error);
}
function errorHandler(e) {

  console.log('Error: ' + e);
}
function error(e) {

  console.log('Error: ' + e);
}



/*src http://codepen.io/matt-west/pen/CrfKh?editors=1010 */

function displayEntries(entries) {
  // Clear out the current file browser entries.
  fileList.innerHTML = '';

  entries.forEach(function(entry, i) {
    var li = document.createElement('li');

    var link = document.createElement('a');
    link.innerHTML = entry.name;
    link.className = 'edit-file';
    li.appendChild(link);

    var delLink = document.createElement('a');
    delLink.innerHTML = '[x]';
    delLink.className = 'delete-file';
    li.appendChild(delLink);

    fileList.appendChild(li);

    // Setup an event listener that will load the file when the link
    // is clicked.
    link.addEventListener('click', function(e) {
      e.preventDefault();
      loadFile(entry.name);
    });

    // Setup an event listener that will delete the file when the delete link
    // is clicked.
    delLink.addEventListener('click', function(e) {
      e.preventDefault();
      deleteFile(entry.name);
    });
  });
}


function listFiles() {
  var dirReader = filesystem.root.createReader();
  var entries = [];

  var fetchEntries = function() {
    dirReader.readEntries(function(results) {
      if (!results.length) {
        displayEntries(entries.sort().reverse());
      } else {
        entries = entries.concat(results);
        fetchEntries();
      }
    }, errorHandler);
  };

  fetchEntries();
}
/*end outside code */
