// Designed for use as a SharePoint WebPart
//<script src="../../SiteAssets/jquery-3.3.1.min.js" type="text/javascript"></script>
//<script language="javascript" type="text/javascript">
(function() {
  const library = 'Testlibrary';
  const webUrl =
    window.location.protocol +
    '//' +
    window.location.host +
    _spPageContextInfo.webServerRelativeUrl;

  // Get UI variables
  const requestTypeValue = document.getElementById('requestType'),
    changeTypeValue = document.getElementById('changeType'),
    uiSupplierNumber = document.getElementById('supplierNumberDiv'),
    uiChangeType = document.getElementById('changeTypeDiv'),
    uiChangeDetail = document.getElementById('changeDetailDiv'),
    uiPaymentTerms = document.getElementById('paymentTermsDiv'),
    supplierTypeValue = document.getElementById('supplierType'),
    uiSupplierType = document.getElementById('supplierTypeDiv'),
    uiOneTime = document.getElementById('oneTimeDiv');

  requestTypeValue.addEventListener('click', function() {
    uiSupplierInput();
  });

  // DOM load event
  document.addEventListener('DOMContentLoaded', uiSupplierInput);

  // Add form submit event listeners
  document
    .getElementById('supplierSubmit')
    .addEventListener('click', function(e) {
      formSubmit();
      e.preventDefault();
    });
  document
    .getElementById('addFileButton')
    .addEventListener('click', function(e) {
      uploadDocument();
      e.preventDefault();
    });


  // Set form input based on request type
  function uiSupplierInput() {
    if (requestTypeValue.value === 'Update') {
      uiPaymentTerms.style.display = 'none';
      uiSupplierType.style.display = 'none';
      uiOneTime.style.display = 'none';
      uiSupplierNumber.style.display = 'block';
      uiChangeDetail.style.display = 'block';
      uiChangeType.style.display = 'block';
    } else {
      uiPaymentTerms.style.display = 'block';
      uiSupplierType.style.display = 'block';
      uiOneTime.style.display = 'block';
      uiChangeDetail.style.display = 'none';
      uiSupplierNumber.style.display = 'none';
      uiChangeType.style.display = 'none';
    }
  }

  // Create SharePoint Document Set on form submit
  // Get id number of last item in library
  function formSubmit() {
    // Library that holds Document Set

    getLastId(
      library,
      function(id) {
        // Suppler detail to be passed into Document Set
        const itemProperties = getSupplierDetail();
        // Use last id to name new Document Set
        id += 1000;
        const docSetTitle = 'Supplier Request ' + id;
        // Pass required info to create Document Set
        createDocSetObject(library, docSetTitle, itemProperties);
      },
      function(sender, args) {
        console.log('Error:' + args.get_message());
      }
    );
  }

  // Get form input
  function getSupplierDetail() {
    const requestType = document.getElementById('requestType').value,
      supplierNumber = document.getElementById('supplierNumber').value,
      supplierName = document.getElementById('supplierName').value,
      changeType = document.getElementById('changeType').value,
      changeDetail = document.getElementById('changeDetail').value,
      paymentTerms = document.getElementById('paymentTerms').value,
      supplierType = document.getElementById('supplierType').value,
      oneTime = document.getElementById('oneTime').checked ? 'Yes' : 'No',
      comments = document.getElementById('comments').value;

    const itemProperties = {
      Request_x0020_Type: requestType,
      Supplier_x0020_Number: supplierNumber,
      Supplier_x0020_Name: supplierName,
      Change_x0020_Type: changeType,
      Change_x0020_Detail: changeDetail,
      Payment_x0020_Terms: paymentTerms,
      Supplier_x0020_Type: supplierType,
      One_x002d_time_x0020_Supplier: oneTime,
      Request_x0020_Comments: comments
    };

    return itemProperties;
  }

  // Get ID of last folder created
  function getLastId(library, Success, Error) {
    const caml =
      '<View><Query><Where>' +
      "<Eq><FieldRef Name='FSObjType' /><Value Type='int'>1</Value></Eq>" +
      '</Where>' +
      "<OrderBy><FieldRef Name='ID' Ascending='False' /></OrderBy>" +
      '</Query>' +
      "<ViewFields><FieldRef Name='ID' /></ViewFields>" +
      '<RowLimit>1</RowLimit>' +
      '</View>';
    const ctx = SP.ClientContext.get_current();
    const web = ctx.get_web();
    const list = web.get_lists().getByTitle(library);
    const query = new SP.CamlQuery();
    query.set_viewXml(caml);
    const items = list.getItems(query);
    ctx.load(items);
    ctx.executeQueryAsync(function() {
      const enumerator = items.getEnumerator();
      enumerator.moveNext();
      const item = enumerator.get_current();
      const id = item.get_id();
      Success(id);
    }, Error);
  }

  const createDocSetObject = function(list, title, item) {
    var defer = $.Deferred();
    // list name, Document Set title, and the Document Set's content type
    // Data of created Document Set is returned and used to set Document Set properties
    createDocSet(
      list,
      title,
      '0x0120D520006453979D367BA7428D37D9A566C9F962'
    ).then(
      function(response) {
        var folder = response.d;
        // Save Document Set Id, eTag, and type for the update metadata call
        item.Id = folder.Id;
        item.eTag = folder.__metadata.etag.split('"')[1].toString();
        var type = 'SP.Data.' + list + 'Item';
        update(list, item, type).then(
          function(response2) {
            //Formulate your response to the calling funciton
            var result = console.log('Success!');
            defer.resolve(result);
          },
          function(error) {
            defer.reject(error);
          }
        );
      },
      function(error) {
        defer.reject(error);
      }
    );
    return defer.promise;
  };

  const createDocSet = function(listName, folderName, folderContentTypeId) {
    var listUrl = webUrl + '/' + listName;
    var folderPayload = {
      Title: folderName,
      Path: listUrl
    };

    //Create Document Type
    return $.ajax({
      url: webUrl + '/_vti_bin/listdata.svc/' + listName,
      method: 'POST',
      contentType: 'application/json;odata=verbose',
      data: JSON.stringify(folderPayload),
      headers: {
        Accept: 'application/json;odata=verbose',
        Slug: listUrl + '/' + folderName + '|' + folderContentTypeId
      }
    });
    console.log('createDocSet successful');
  };

  const update = function(list, item, type) {
    const eTag = item.eTag;
    delete item.eTag;
    //You may need to escape the list name when setting the __metadata property "type".
    if (type != undefined) {
      item['__metadata'] = { type: type };
    } else {
      item['__metadata'] = { type: 'SP.Data.' + list + 'ListItem' };
    }

    return $.ajax({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;odata=verbose',
        Accept: 'application/json;odata=verbose',
        'X-RequestDigest': document.getElementById('__REQUESTDIGEST').value,
        'X-HTTP-Method': 'MERGE',
        'If-Match': '"' + eTag + '"'
      },
      data: JSON.stringify(item),
      url:
        webUrl +
        "/_api/web/lists/getbytitle('" +
        list +
        "')/items(" +
        item.Id +
        ')'
    });
  };

  function uploadDocument() {
    // Define the folder path for this example.
    const SITE = '/sites/TeamSites/WC%20Accounting/';
    var docSet = 'Supplier%20Request%201524627523547';
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
          var fileMetadata = new Object();
          fileMetadata['Title'] = 'Testing Upload';
          var changeItem = updateFileMetadata(library, item, fileMetadata);
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

  function updateFileMetadata(library, item, fileMetadata) {
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
    if (fileMetadata == null || fileMetadata == 'undefined') {
      // For library having no column properties to be updated
      fileMetadata = new Object();
    }
    fileMetadata['__metadata'] = metadataColumn;
    jsonString = JSON.stringify(fileMetadata);
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
})();
//</script>
