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
  uiOneTime = document.getElementById('oneTimeDiv');

requestTypeValue.addEventListener('click', function() {
  uiSupplierInput();
});

function UI() {}

// Add selected files to list
UI.prototype.addFileToList = function(fileName) {
  const list = document.getElementById('fileList');
  // Create div element
  const row = document.createElement('div');
  row.className = 'row mb-2';
  // Insert columns
  row.innerHTML = `
    <div class="col-md-4"><p>${fileName}</p></div>
      <div class="col-md-4">
        <select title="Select document type(s)" class="selectpicker" data-width="100%" multiple data-selected-text-format="count">
          <option value="ISO9001 or TS16949 Certificate">ISO9001 or TS16949 Certificate</option>
          <option value="Certificate of Liability Insurance">Certificate of Liability Insurance</option>
          <option value="Confidentiality Agreement">Confidentiality Agreement</option>
          <option value="Warranty Agreement">Warranty Agreement</option>
          <option value="Initial Supplier Questionnaire">Initial Supplier Questionnaire</option>
          <option value="Government Contract Compliance">Government Contract Compliance</option>
          <option value="Supplier Received Global Code of Conduct">Supplier Received Global Code of Conduct</option>
          <option value="Financial Evaluation - D&B Report">Financial Evaluation - D&B Report</option>
          <option value="W-9 Tax Form">W-9 Tax Form</option>
        </select>
      </div>
    `;
  // Display new files selected
  list.appendChild(row);
  $('.selectpicker').selectpicker('render');
};

UI.prototype.clearFileList = function() {
  const list = document.getElementById('fileList');
  // Clear any prior selected files
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }
};

// DOM load event
document.addEventListener('DOMContentLoaded', uiSupplierInput);

var selDiv = '';
var storedFiles = []; //store the object of the all files

document.addEventListener('DOMContentLoaded', init, false);

function init() {
  //To add the change listener on over file element
  document
    .querySelector('#uploadInput')
    .addEventListener('change', handleFileSelect, false);
  //allocate division where you want to print file name
  selDiv = document.querySelector('#filelist');
}

function handleFileSelect(e) {
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
    formSubmit();
    e.preventDefault();
  });
document.getElementById('addFileButton').addEventListener('click', function(e) {
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

//</script>
