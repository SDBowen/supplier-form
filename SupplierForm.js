//<script language="javascript" type="text/javascript">

var webUrl = window.location.protocol + "//" + window.location.host + _spPageContextInfo.webServerRelativeUrl;
 
var createDocSet = function(listName, folderName, folderContentTypeId){
    var listUrl = webUrl + "/" + listName;
    var folderPayload = {
        'Title' : folderName,
        'Path' : listUrl
    };
 
    //Create Document Type
    return $.ajax({
        url: webUrl + "/_vti_bin/listdata.svc/" + listName,
        method: "POST",
        contentType: "application/json;odata=verbose",
        data: JSON.stringify(folderPayload),
        headers: {
            "Accept": "application/json;odata=verbose",
            "Slug": listUrl + "/" + folderName + "|" + folderContentTypeId
        }
    });
    console.log('createDocSet successful');    
};

var update = function (list, item, type) {
    var eTag = item.eTag;
    delete item.eTag;
    //You may need to escape the list name when setting the __metadata property "type".
    if(type != undefined){
        item["__metadata"] = {"type": type};
    }else{
        item["__metadata"] = {"type": "SP.Data." + list + "ListItem"};
    }

    return $.ajax({
        method: 'POST',
        headers: {
            "Content-Type": "application/json;odata=verbose",
            "Accept": "application/json;odata=verbose",
            "X-RequestDigest": document.getElementById("__REQUESTDIGEST").value,
            "X-HTTP-Method": "MERGE",
            "If-Match": '"' + eTag + '"'
        },
        data: JSON.stringify(item),
        url: webUrl + "/_api/web/lists/getbytitle('" + list + "')/items(" + item.Id + ")"
    });
};

var createDocSetObject = function(title, item){
    var list = 'Testlibrary';
    var defer = $.Deferred();
    // list name, Document Set title, and the Document Set's content type
    // Data of created Document Set is returned and used to set Document Set properties 
    createDocSet(list, title, '0x0120D520006453979D367BA7428D37D9A566C9F962').then(function(response){
        var folder = response.d;
        // Save Document Set Id, eTag, and type for the update metadata call
        item.Id = folder.Id; 
        item.eTag = folder.__metadata.etag.split('\"')[1].toString();
        var type = "SP.Data." + list + "Item";
        update(list, item, type).then(function(response2){
            //Formulate your response to the calling funciton
            var result = console.log('Success!');
            defer.resolve(result);
        }, function(error){
            defer.reject(error);
        });
    }, function(error){
        defer.reject(error);
    });
    return defer.promise;
};
//</script>

//createDocSetObject('TestDoc16', {'Title': 'testing entry'});