// Designed for use as a SharePoint WebPart
//<script language="javascript" type="text/javascript">

var webUrl =
  window.location.protocol +
  '//' +
  window.location.host +
  _spPageContextInfo.webServerRelativeUrl;

document.getElementById('supplierSubmit').addEventListener('click', formSubmit);


function formSubmit() {
  var requestType = document.getElementById('requestType').value,
    supplierNumber = document.getElementById('supplierNumber').value,
    supplierName = document.getElementById('supplierName').value,
    changeType = document.getElementById('changeType').value,
    changeDetail = document.getElementById('changeDetail').value,
    paymentTerms = document.getElementById('paymentTerms').value,
    supplierType = document.getElementById('supplierType').value,
    oneTime = document.getElementById('oneTime').checked
      ? 'Yes'
      : 'No',
    comments = document.getElementById('comments').value;
  //***
  // ID increment needed
  //***
  var docSetTitle = 'Supplier Request ' + Date.now();
  var itemProperties = {
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

  //***
  // Library that holds Document Set records
  //***
  var list = 'Testlibrary';

  createDocSetObject(list, docSetTitle, itemProperties);
};

// Takes Document Set name and item properties to be set
var createDocSetObject = function(list, title, item) {
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

var createDocSet = function(listName, folderName, folderContentTypeId) {
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

var update = function(list, item, type) {
  var eTag = item.eTag;
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
//</script>

//createDocSetObject('TestDoc16', {'Title': 'testing entry'});
//createDocSetObject('TestDoc11', {'Title': 'This is a test title2', 'DocumentSetDescription': 'testing entry2'});
