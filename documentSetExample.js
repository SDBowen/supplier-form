

//<script language="javascript" type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.8.1/jquery.min.js"></script>  
//<script language="javascript" type="text/javascript">

    $(document).ready(function() {  
        var scriptbase = _spPageContextInfo.webServerRelativeUrl + "/_layouts/15/";  
        $.getScript(scriptbase + "SP.Runtime.js", function() {  
            $.getScript(scriptbase + "SP.js", function() {  
                $.getScript(scriptbase + "SP.DocumentManagement.js", createDocumentSet);  
            });  
        });  
    });  
    var oLibraryFolder, clientContext, docSetContentType;  
  
    function createDocumentSet() {  
        //Get the client context,web and library object.  
        clientContext = new SP.ClientContext.get_current();  
        oWeb = clientContext.get_web();  
        var oList = oWeb.get_lists().getByTitle("Demo Library");  
        //Load the library object  
        clientContext.load(oList);  
        //Get the root folder of the library and load it  
        oLibraryFolder = oList.get_rootFolder();  
        clientContext.load(oLibraryFolder);  
        //Get the content type for the document set and load it  
        var documentSetContentTypeID = "0x0120D520";  
        documentSetContentType = clientContext.get_site().get_rootWeb().get_contentTypes().getById(documentSetContentTypeID);  
        clientContext.load(documentSetContentType);  
        //Execute the batch  
        clientContext.executeQueryAsync(QuerySuccess, QueryFailure);  
    }  
  
    function QuerySuccess() {  
        //Set the document set name  
        var documentSetName = "Long Term Execution Planning";  
        SP.DocumentSet.DocumentSet.create(clientContext, oLibraryFolder, documentSetName, documentSetContentType.get_id());  
        clientContext.executeQueryAsync(SecondQuerySuccess, SecondQueryFailure);  
    }  
  
    function QueryFailure() {  
        console.log('Request failed - ' + args.get_message());  
    }  
  
    function SecondQuerySuccess() {  
        console.log('Document Set Created.');  
    }  
  
    function SecondQueryFailure(sender, args) {  
        console.log('Request failed - ' + args.get_message());  
    }  
//</script>