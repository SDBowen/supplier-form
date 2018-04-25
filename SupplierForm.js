//<script language="javascript" type="text/javascript">

var webUrl =
  window.location.protocol +
  '//' +
  window.location.host +
  _spPageContextInfo.webServerRelativeUrl;

document.querySelector('.supplierSubmit').addEventListener("click", function(){
  var requestType = document.getElementsByClassName('requestType')[0].value,
    supplierNumber = document.getElementsByClassName('supplierNumber')[0].value,
    supplierName = document.getElementsByClassName('supplierName')[0].value,
    changeType = document.getElementsByClassName('changeType')[0].value,
    changeDetail = document.getElementsByClassName('changeDetail')[0].value,
    paymentTerms = document.getElementsByClassName('paymentTerms')[0].value,
    supplierType = document.getElementsByClassName('supplierType')[0].value,
    oneTime = document.getElementsByClassName('oneTime')[0].checked,
    comments = document.getElementsByClassName('comments')[0].value;
//***
// ID increment needed
//***
  var docSetTitle = 'Supplier Request ' + Date.now(); 
  var itemProperties = {
    'Request Type': requestType,
    'Supplier Number': supplierNumber,
    'Supplier Name': supplierName,
    'Change Type': ChangeType,
    'Change Detail': changeDetail,
    'Payment Terms': paymentTerms,
    'Supplier Type': supplierType,
    'One-time Supplier': oneTime,
    'Comments': comments  //autoformat removes quotes
  };

  createDocSetObject(docSetTitle, itemProperties);
});

// Takes Document Set name and item properties to be set
var createDocSetObject = function(title, item) {
  //***
  // Library that holds Document Set records
  //***
  var list = 'Testlibrary';
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
      console.log(JSON.stringify(folder));
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
