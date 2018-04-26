//<script src="../SiteAssets/jquery-3.3.1.min.js"></script>
//<script language="javascript" type="text/javascript">
function uploadDocument() {
  if (!window.FileReader) {
    alert('This browser does not support the HTML5 File APIs');
    return;
  }

  var element = document.getElementById('uploadInput');
  // Get file name
  var file = element.files[0];
  var parts = element.value.split('\\');
  var fileName = parts[parts.length - 1];

  var reader = new FileReader();
  reader.onload = function(e) {
    addItem(e.target.result, fileName);
  };
  reader.onerror = function(e) {
    alert(e.target.error);
  };
  reader.readAsArrayBuffer(file);

  function addItem(buffer, fileName) {
    // SharePoint library to upload file
    const spSite = '/sites/TeamSites/WC%20Accounting/'
    var library = 'Testlibrary';
    var docSet = 'Supplier%20Request%201524627523547'
    var fullPath = spSite + library + '/' + docSet;
    var call = uploadDocument(buffer, fileName, fullPath);

    // Get uploaded file SharePoint metadata
    call.done(function(data, textStatus, jqXHR) {
      var item = data.d;
      // Set file metadata
      var call2 = updateItemFields(item, library);
      // Upload success
      call2.done(function(data, textStatus, jqXHR) {
        alert('Item added');
      });
      call2.fail(function(jqXHR, textStatus, errorThrown) {
        failHandler(jqXHR, textStatus, errorThrown);
      });
    });
    call.fail(function(jqXHR, textStatus, errorThrown) {
      failHandler(jqXHR, textStatus, errorThrown);
    });
  }

  function uploadDocument(buffer, fileName, library) {
    var url = _spPageContextInfo.webAbsoluteUrl
    + "/_api/web/GetFolderByServerRelativeUrl('"+library+"')/Files/add(url='" + fileName + "',overwrite=true)?$expand=ListItemAllFields";
    
    var call = jQuery.ajax({
      url: url,
      type: 'POST',
      data: buffer,
      processData: false,
      headers: {
        Accept: 'application/json;odata=verbose',
        'X-RequestDigest': jQuery('#__REQUESTDIGEST').val()
      }
    });
    return call;
  }

  function updateItemFields(item, library) {
    var call = jQuery.ajax({
      url:
        _spPageContextInfo.webAbsoluteUrl +
        "/_api/Web/Lists/getByTitle('" + library + "')/Items(" +
        item.ListItemAllFields.Id +
        ')',
      type: 'POST',
      // Metadata to be set on uploaded file
      data: JSON.stringify({
        __metadata: { type: 'SP.Data.TestlibraryItem' },
        Title: 'Testing Upload' 
      }),
      headers: {
        Accept: 'application/json;odata=verbose',
        'Content-Type': 'application/json;odata=verbose',
        'X-RequestDigest': jQuery('#__REQUESTDIGEST').val(),
        'IF-MATCH':
          '"' +
          // File etag needed for upload
          item.ListItemAllFields.__metadata.etag.split('"')[1].toString() +
          '"',
        'X-Http-Method': 'MERGE'
      }
    });

    return call;
  }

  function failHandler(jqXHR, textStatus, errorThrown) {
    var response = JSON.parse(jqXHR.responseText);
    var message = response ? response.error.message.value : textStatus;
    alert('Call failed. Error: ' + message);
  }
}
//</script>
