//<script>

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

// Update form for selected change type
UI.prototype.formType = function() {
  this.formReset();
  const changeDiv = document.getElementById('changeDetailDiv');

  // Create label element
  const changeLabel = document.createElement('label');
  changeLabel.setAttribute('for', 'changeDetail');
  changeLabel.innerHTML = 'This is working';    //VAR

  // Create input element
  changeInput.setAttribute('class', 'form-control');
  const changeInput = document.createElement('input');  //VAR
  changeInput.setAttribute('type', 'text');   //VAR
  changeInput.setAttribute('id', 'changeDetail');   //VAR

  // Display input and label
  changeDiv.appendChild(changeLabel);
  changeDiv.appendChild(changeInput);
};

UI.prototype.clearFileList = function() {
  const list = document.getElementById('fileList');
  // Clear any prior selected files
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }
};

UI.prototype.formReset = function() {
  const changeDiv = document.getElementById('changeDetailDiv');
  // Clear any prior selected files
  while (changeDiv.firstChild) {
    changeDiv.removeChild(changeDiv.firstChild);
  }
};

// Set form input based on request type
UI.prototype.formSetup = function() {
  this.formType();
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
};

UI.prototype.data = {
  activeStatus: { label: 'Change Supplier to:', options: ['Active', 'Inactive'] },
  supplierType: { label: 'Supplier Type:', options: ['Production (Certified)', 'Production (Non-Certified)', 'MRO', 'Warranty', 'Employee', 'Other'] },
  nameChange: { label: 'New Name:' },
  remitAddress: { label: 'New Remit Address:' },
  paymentTerms: { label: 'Change Supplier to:', options: ['Active', 'Inactive'] },
  paymentType: { label: 'Change Supplier to:', options: ['Active', 'Inactive'] },
  other: { label: 'Change Description:' }
};
//</script>


