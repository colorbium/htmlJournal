var supportsSyncFileSystem = chrome && chrome.syncFileSystem;

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
function onInitFs(fs) {
  console.log('File System Created')
  //fs.root.getFile('log.txt', {create: true, exclusive: true}, function(fileEntry) {
  //}, error);

}
function openFileSystem(){
//  if (!chrome || !chrome.syncFileSystem ||
//      !chrome.syncFileSystem.requestFileSystem) {
//    error('Syncable FileSystem is not supported in your environment.');
//    return;
//  }

  if (chrome.syncFileSystem.setConflictResolutionPolicy) {
    chrome.syncFileSystem.setConflictResolutionPolicy('last_write_win');
    show('#conflict-policy')
  }
  log('Obtaining syncable FileSystem...');
  chrome.syncFileSystem.requestFileSystem(function (fs) {
    if (chrome.runtime.lastError) {
      error('requestFileSystem: ' + chrome.runtime.lastError.message);
      $('#fs-syncable').classList.remove('selected');
      hide('#conflict-policy')
      return;
    }
    onFileSystemOpened(fs, true);
  });
}


//  window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
//  window.requestFileSystem(window.PERSISTENT, 5*1024*1024, onInitFs, error);


function error(e) {
  console.log('Error ' + e);
}
