// Designed for use as a SharePoint WebPart
//<script language="javascript" type="text/javascript">
(function() {
  const webUrl =
    window.location.protocol +
    '//' +
    window.location.host +
    _spPageContextInfo.webServerRelativeUrl;

  // Add form submit event listener
  document
    .getElementById('supplierSubmit')
    .addEventListener('click', function(e) {
      formSubmit;
      e.preventDefault();
    });

  // Create SharePoint Document Set on form submit
  // Get id number of last item in library
  function formSubmit() {
    // Library that holds Document Set
    const library = 'Testlibrary';

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
})();
//</script>
