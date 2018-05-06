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

  // DOM load event
  document.addEventListener('DOMContentLoaded', uiSupplierInput);

  // Add form submit event listeners
  document
    .getElementById('supplierSubmit')
    .addEventListener('click', function(e) {
      formSubmit();
      e.preventDefault();
    });
  document
    .getElementById('addFileButton')
    .addEventListener('click', function(e) {
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
