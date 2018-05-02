function uploadDocument() {
    // Define the folder path for this example.
    var serverRelativeUrlToFolder = 'SiteAssets';

    // Get test values from the file input and text input page controls.
    var fileInput = document.getElementById('uploadInput');
    var newName = jQuery('#displayName').val(); /// Change this ///
    var fileCount = fileInput[0].files.length;
    // Get the server URL.
    var serverUrl = _spPageContextInfo.webAbsoluteUrl;
    var filesUploaded = 0;
    for (var i = 0; i < fileCount; i++) {
        // Initiate method calls using jQuery promises.
        // Get the local file as an array buffer.
        var getFile = getFileBuffer(i);
        getFile.done(function (arrayBuffer, i) {

            // Add the file to the SharePoint folder.
            var addFile = addFileToFolder(arrayBuffer, i);
            addFile.done(function (file, status, xhr) {
               //Get ID of File uploaded 
                var getfileID = getItem(file.d);
                getfileID.done(function (fResult) {
                    var colObject = new Object();
                    colObject["FileType"] = fileType;
                    var changeItem = updateFileMetadata(libraryName, fResult.d, colObject);
                    changeItem.done(function (result) {
                        filesUploaded++;
                        if (fileCount == filesUploaded) {
                            alert("All files uploaded successfully");
                            //$("#msg").append("<div>All files uploaded successfully</div>");
                            $("#getFile").value = null;
                            filesUploaded = 0;
                        }
                    });
                    changeItem.fail(function (result) {

                    });

                }, function () { });

            });
            addFile.fail(onError);
        });
        getFile.fail(onError);

    }

    // Get the local file as an array buffer.
    function getFileBuffer(i) {
        var deferred = jQuery.Deferred();
        var reader = new FileReader();
        reader.onloadend = function (e) {
            deferred.resolve(e.target.result, i);
        }
        reader.onerror = function (e) {
            deferred.reject(e.target.error);
        }
        reader.readAsArrayBuffer(fileInput[0].files[i]);
        return deferred.promise();
    }

    // Add the file to the file collection in the Shared Documents folder.
    function addFileToFolder(arrayBuffer, i) {
        var index = i;

        // Get the file name from the file input control on the page.
        var fileName = fileInput[0].files[index].name;

        // Construct the endpoint.
        var fileCollectionEndpoint = String.format(
                "{0}/_api/web/getfolderbyserverrelativeurl('{1}')/files" +
                "/add(overwrite=true, url='{2}')",
                serverUrl, serverRelativeUrlToFolder, fileName);

        // Send the request and return the response.
        // This call returns the SharePoint file.
        return jQuery.ajax({
            url: fileCollectionEndpoint,
            type: "POST",
            data: arrayBuffer,
            processData: false,
            headers: {
                "accept": "application/json;odata=verbose",
                "X-RequestDigest": jQuery("#__REQUESTDIGEST").val(),
                "content-length": arrayBuffer.byteLength
            }
        });
    }
}

// Display error messages. 
function onError(error) {
    alert(error.responseText);
}