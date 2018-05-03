//<script src="../SiteAssets/jquery-3.3.1.min.js"></script>
//<script language="javascript" type="text/javascript">

function uploadDocument() {
  // Define the folder path for this example.
  const SITE = '/sites/TeamSites/WC%20Accounting/';
  var library = 'Testlibrary';
  var docSet = 'Supplier%20Request%201524627523547';
  var fullPath = SITE + library + '/' + docSet;

  // Get values from the file input and text input page controls.
  var fileInput = document.getElementById('uploadInput');
  var fileCount = fileInput.files.length;
  // Get the server URL.
  var filesUploaded = 0;
  for (var i = 0; i < fileCount; i++) {
    // Initiate method calls using jQuery promises.
    // Get the local file as an array buffer.
    var getFile = getFileBuffer(i);
    getFile.done(function(arrayBuffer, i) {
      // Add the file to the SharePoint folder.
      var addFile = addFileToFolder(arrayBuffer, i);
      addFile.done(function(data, status, xhr) {
        //Get ID of File uploaded
        // var getfileID = getItem(file.d);
        // getfileID.done(function (fResult) {
        item = data.d;
        var colObject = new Object();
        colObject['Title'] = 'Testing Upload';
        var changeItem = updateFileMetadata(library, item, colObject);
        changeItem.done(function(result) {
          filesUploaded++;
          if (fileCount == filesUploaded) {
            alert('All files uploaded successfully');
            //$("#msg").append("<div>All files uploaded successfully</div>");
            $('#getFile').value = null;
            filesUploaded = 0;
          }
        });
        changeItem.fail(function(result) {});

        //}, function () { });
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

function updateFileMetadata(library, item, colPropObject) {
  var def = jQuery.Deferred();

  var restSource =
    _spPageContextInfo.webAbsoluteUrl +
    "/_api/Web/Lists/getByTitle('" +
    library +
    "')/Items(" +
    item.ListItemAllFields.Id +
    ')';
  var jsonString = '';

  var metadataColumn = new Object();
  metadataColumn['type'] = item.__metadata.type;
  //columnArray.push(metadataColumn);
  if (colPropObject == null || colPropObject == 'undefined') {
    // For library having no column properties to be updated
    colPropObject = new Object();
  }
  colPropObject['__metadata'] = metadataColumn;
  jsonString = JSON.stringify(colPropObject);
  var dfd = jQuery.Deferred();
  jQuery.ajax({
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
    },
    success: function(data) {
      var d = data;
      dfd.resolve(d);
    },
    error: function(err) {
      dfd.reject(err);
    }
  });

  return dfd.promise();
}
/*=====================================================
Get Item for Uploaded Document
=======================================================*/
function getItem(file) {
  var def = jQuery.Deferred();
  jQuery.ajax({
    url: file.ListItemAllFields.__deferred.uri,
    type: 'GET',
    dataType: 'json',
    headers: {
      Accept: 'application/json;odata=verbose'
    },
    success: function(data) {
      def.resolve(data);
    },
    error: function(data, arg, jhr) {
      def.reject(data, arg, jhr);
    }
  });
  return def.promise();
  //return call;
}
//</script>
