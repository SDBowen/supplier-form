//<script>
function uploadDocument(title) {
  // Define the folder path for this example.
  const SITE = '/sites/TeamSites/WC%20Accounting/';
  var docSet = title.replace(/ /g, '%20');
  var fullPath = SITE + library + '/' + docSet;

  // Get file(s) detail
  var fileInput = document.getElementById('uploadInput');
  var fileCount = fileInput.files.length;

  for (var i = 0; i < fileCount; i++) {
    // Get the local file as an array buffer.
    var getFile = getFileBuffer(i);
    getFile.done(function(arrayBuffer, i) {
      // Add the file to the SharePoint folder.
      var addFile = addFileToFolder(arrayBuffer, i);
      addFile.done(function(data, status, xhr) {
        // Add metadata to uploaded file
        item = data.d;
        var changeItem = updateFileMetadata(library, item);
        changeItem.done(function(result) {
          if (fileCount == i + 1) {
            alert('All files uploaded successfully');
          }
        });
        changeItem.fail(function(result) {});
      });
      addFile.fail(onError);
    });
    getFile.fail(onError);
  }

  // Get the local file as an array buffer.
  function getFileBuffer(i) {
    var deferred = jQuery.Deferred();
    var reader = new FileReader();
    reader.onloadend = function(e) {
      deferred.resolve(e.target.result, i);
    };
    reader.onerror = function(e) {
      deferred.reject(e.target.error);
    };
    reader.readAsArrayBuffer(fileInput.files[i]);
    return deferred.promise();
  }

  // Add the file to the file collection in the Shared Documents folder.
  function addFileToFolder(arrayBuffer, i) {
    var index = i;

    // Get the file name from the file input control on the page.
    var fileName = fileInput.files[index].name;

    // Construct the endpoint.
    var fileCollectionEndpoint =
      _spPageContextInfo.webAbsoluteUrl +
      "/_api/web/GetFolderByServerRelativeUrl('" +
      fullPath +
      "')/Files/add(url='" +
      fileName +
      "',overwrite=true)?$expand=ListItemAllFields";

    // Send the request and return the response.
    // This call returns the SharePoint file.
    return jQuery.ajax({
      url: fileCollectionEndpoint,
      type: 'POST',
      data: arrayBuffer,
      processData: false,
      headers: {
        accept: 'application/json;odata=verbose',
        'X-RequestDigest': jQuery('#__REQUESTDIGEST').val()
      }
    });
  }
}

// Display error messages.
function onError(error) {
  alert(error.responseText);
}

function updateFileMetadata(library, item) {
  console.log(JSON.stringify(item));
  var restSource =
    _spPageContextInfo.webAbsoluteUrl +
    "/_api/Web/Lists/getByTitle('" +
    library +
    "')/Items(" +
    item.ListItemAllFields.Id +
    ')';

  let jsonString = JSON.stringify({
    __metadata: { type: 'SP.Data.TestlibraryItem' },
    TestVal: 'Testing Value'
  });

  return jQuery.ajax({
    url: restSource,
    method: 'POST',
    data: jsonString,
    headers: {
      accept: 'application/json;odata=verbose',
      'content-type': 'application/json;odata=verbose',
      'X-RequestDigest': jQuery('#__REQUESTDIGEST').val(),
      'IF-MATCH':
        '"' +
        // File etag needed for upload
        item.ListItemAllFields.__metadata.etag.split('"')[1].toString() +
        '"',
      'X-Http-Method': 'MERGE'
    }
  });
}
//</script>
