// Designed for use as a SharePoint WebPart
//<script language="javascript" type="text/javascript">

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
  uiOneTime = document.getElementById('oneTimeDiv'),
  selDiv = document.querySelector('#filelist');

let storedFiles = []; //store the object of the all files

// DOM load event
document.addEventListener('DOMContentLoaded', init, false);

function init() {
  // Create DOM form
  const ui = new UI();
  ui.formTypeChange();

  // Add event listener on form request type change
  requestTypeValue.addEventListener('change', handleFormChange, false);

  // Add event listener on file upload
  document
    .querySelector('#uploadInput')
    .addEventListener('change', handleFileSelect, false);
}

function handleFormChange() {
  const ui = new UI();
  ui.formTypeChange(); 
}

function handleFileSelect() {
  // Check if file was selected
  if (!e.target.files) return;

  // Get array of file names
  var files = e.target.files;
  var filesArr = Array.prototype.slice.call(files);

  const ui = new UI();

  ui.clearFileList();

  filesArr.forEach(function(f) {
    //print new selected files into the given division
    ui.addFileToList(f.name);
  });
}

// Add form submit event listeners
document
  .getElementById('supplierSubmit')
  .addEventListener('click', function(e) {
    //formSubmit();
    var selectTest = document.getElementsByClassName('selectpicker');
    let testString = '';
    for (let i = 0; i < selectTest.length; i++) {
      for (let e = 0; e < selectTest[i].selectedOptions.length; e++) {
        testString = testString + selectTest[i].selectedOptions[e].value + ', ';
      }
    }
    console.log('testString: ' + testString);
    e.preventDefault();
  });

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

//</script>
