<script type="text/javascript" src="/_layouts/15/sp.runtime.js"></script> 
<script type="text/javascript" src="/_layouts/15/sp.js"></script> 
<script type="text/javascript" src="/_layouts/15/SP.DocumentManagement.js"></script>
<script language="javascript" type="text/javascript">


// SP library name
const LIBRARY = 'test-library';
// Data for Document Set creation
let requestNumber = 'WC1009',
    requestType = '',
    requestProperties = {
        'Supplier Number:': '123456',
        'Supplier Name:': 'Steel W',
        'Change Type:': 'Payment Terms',
        //'New Data': 'N45',
        'Comments:': 'This is only a test.'
    };
    

let createDocumentSet = function (libraryName, docSetName, docSetProperties) {

    // Get user client context, web, and library object.
    var clientContext = new SP.ClientContext.get_current();  
    var web = clientContext.get_web(); 
    var list = web.get_lists().getByTitle(libraryName);
    // Load library object
    clientContext.load(list);
    // Get the root folder of the library and load it  
    var rootFolder = list.get_rootFolder();  
    clientContext.load(rootFolder);
    // Get Document Set ID and load it 
    var docSetContentTypeID = "0x0120D520";  
    docSetContentType = clientContext.get_site().get_rootWeb().get_contentTypes().getById(docSetContentTypeID);  
    clientContext.load(docSetContentType);
    
    clientContext.executeQueryAsync(function () {
        // Create new Document Set
        SP.DocumentSet.DocumentSet.create(clientContext, rootFolder, docSetName, docSetContentType.get_id());
        // Get Document Set metadata
        var docSetFolder = web.getFolderByServerRelativeUrl(rootFolder.get_serverRelativeUrl() + '/' + docSetName);
        var docSetFolderItem = docSetFolder.get_listItemAllFields();
        // Update metadata
        if (docSetContentType != null) {
            for (var property in docSetProperties) {
                if (docSetProperties.hasOwnProperty(property) === true) {
                    docSetFolderItem.set_item(property, docSetProperties[property]);
                }
            }
        }
        docSetFolderItem.update();
        clientContext.load(docSetFolderItem);
        clientContext.executeQueryAsync(function () {
            console.log('success: ' + docSetFolderItem);
        }, console.log('fail'));
    },
    console.log('fail'));
 
};

window.onload = function() {
    document.getElementsByClassName('supplierSubmit').onclick = function() {
        console.log("Fire");
        createDocumentSet(LIBRARY, requestNumber, requestProperties);
    }
}

</script>