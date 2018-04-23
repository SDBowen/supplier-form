//<script src="../SiteAssets/jquery-3.3.1.min.js"></script>
//<script language="javascript" type="text/javascript">
function uploadDocument() {
    if (!window.FileReader) {
        alert("This browser does not support the HTML5 File APIs");
        return;
    }

    var element = document.getElementById("uploadInput");
    var file = element.files[0];
    var parts = element.value.split("\\");
    var fileName = parts[parts.length - 1];

    var reader = new FileReader();
    reader.onload = function (e) {
        addItem(e.target.result, fileName);
    }
    reader.onerror = function (e) {
        alert(e.target.error);
    }
    reader.readAsArrayBuffer(file);

    function addItem(buffer, fileName) {
        var call = uploadDocument(buffer, fileName);
        call.done(function (data, textStatus, jqXHR) {
            //console.log('call1 data return: ' + JSON.stringify(data))
                //console.log('call2 data returns: ' + JSON.stringify(data))
                var item = data.d;
                console.log('item: ' + JSON.stringify(item.ListItemAllFields));
                console.log('Id: ' + JSON.stringify(item.ListItemAllFields.Id));
                console.log(item.ListItemAllFields.Id);
                console.log(item.ListItemAllFields.__metadata.etag);
                var call3 = updateItemFields(item);
                call3.done(function (data, textStatus, jqXHR) {
                    var div = jQuery("#message");
                    div.text("Item added");
                });
                call3.fail(function (jqXHR, textStatus, errorThrown) {
                    failHandler(jqXHR, textStatus, errorThrown);
                });
        });
        call.fail(function (jqXHR, textStatus, errorThrown) {
            failHandler(jqXHR, textStatus, errorThrown);
        });
    }

    function uploadDocument(buffer, fileName) {
        var url = String.format(
            "{0}/_api/Web/Lists/getByTitle('Testlibrary')/RootFolder/Files/Add(url='{1}', overwrite=true)?$expand=ListItemAllFields",
            _spPageContextInfo.webAbsoluteUrl, fileName);
        var call = jQuery.ajax({
            url: url,
            type: "POST",
            data: buffer,
            processData: false,
            headers: {
                Accept: "application/json;odata=verbose",
                "X-RequestDigest": jQuery("#__REQUESTDIGEST").val(),
                //"Content-Length": buffer.byteLength
            }
        });

        return call;
    }

    function updateItemFields(item) {
        var call = jQuery.ajax({
        

            url: _spPageContextInfo.webAbsoluteUrl +
                "/_api/Web/Lists/getByTitle('Testlibrary')/Items(" +
                item.ListItemAllFields.Id + ")",
            type: "POST",
            data: JSON.stringify({
                "__metadata": { type: "SP.Data.TestlibraryItem" },
                Title: 'Testing Upload'
            }),
            headers: {
                Accept: "application/json;odata=verbose",
                "Content-Type": "application/json;odata=verbose",
                "X-RequestDigest": jQuery("#__REQUESTDIGEST").val(),
                "IF-MATCH": '"' + item.ListItemAllFields.__metadata.etag.split('\"')[1].toString() + '"',
                "X-Http-Method": "MERGE"
            }
        });

        return call;
    }

    function failHandler(jqXHR, textStatus, errorThrown) {
        var response = JSON.parse(jqXHR.responseText);
        var message = response ? response.error.message.value : textStatus;
        alert("Call failed. Error: " + message);
    }
}
//</script>