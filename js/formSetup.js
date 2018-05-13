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
UI.prototype.formSetup = function(requestType) {
  this.formReset();
  if (requestTypeValue.value === 'updateSupplier') {
    const supplierNumberDiv = document.getElementById('supplierNumberDiv');
    const supplierNumberInput = document.createElement('input');
    const supplierNumberLabel = document.createElement('label');
    supplierNumberLabel.setAttribute('for', 'supplierNumber');
    supplierNumberLabel.innerHTML = 'Supplier Number';
    supplierNumberInput.setAttribute('id', 'supplierNumber');
    supplierNumberInput.setAttribute('class', 'form-control');
    supplierNumberDiv.appendChild(supplierNumberLabel);
    supplierNumberDiv.appendChild(supplierNumberInput);

    const changeDiv = document.getElementById('changeDetailDiv');
    const elementType = this.data[requestType].hasOwnProperty('options')
      ? 'select'
      : 'input';
    const changeInput = document.createElement(elementType);

    // Create label element
    const changeLabel = document.createElement('label');
    changeLabel.setAttribute('for', 'changeDetail');
    changeLabel.innerHTML = this.data[requestType].label;
    // Create input element
    changeInput.setAttribute('id', 'changeDetail');
    changeInput.setAttribute('class', 'form-control');
    // If select input add options
    if (elementType === 'select') {
      let option;
      this.data[requestType].options.forEach(function(e) {
        option = document.createElement('option');
        option.setAttribute('value', e);
        option.innerHTML = e;
        changeInput.appendChild(option);
      });
    }

    // Display input and label
    changeDiv.appendChild(changeLabel);
    changeDiv.appendChild(changeInput);
  } else {
    this.addFormInput('supplierType');
    this.addFormInput('paymentTerms');    
  }
};

UI.prototype.clearFileList = function() {
  const fileList = document.getElementById('fileList');
  // Clear any prior selected files
  while (fileList.firstChild) {
    fileList.removeChild(fileList.firstChild);
  }
};

UI.prototype.formReset = function() {
  const changeDiv = document.getElementById('changeDetailDiv');
  const numberDiv = document.getElementById('supplierNumberDiv');
  // Clear any prior selected files
  while (changeDiv.firstChild) {
    changeDiv.removeChild(changeDiv.firstChild);
  }
  while (numberDiv.firstChild) {
    numberDiv.removeChild(numberDiv.firstChild);
  }
  while (newDetail.firstChild) {
    newDetail.removeChild(newDetail.firstChild);
  }
};

UI.prototype.addFormInput = function(requestType) {
  const dom = document.getElementById('newDetail');
  const div = document.createElement('div');
  div.setAttribute('class', 'form-group col-md-4');  
  const elementType = this.data[requestType].hasOwnProperty('options')
    ? 'select'
    : 'input';
  const input = document.createElement(elementType);

  // Create label element
  const label = document.createElement('label');
  label.setAttribute('for', requestType);
  label.innerHTML = this.data[requestType].label;
  // Create input element
  input.setAttribute('id', requestType);
  input.setAttribute('class', 'form-control');
  // If select input add options
  if (elementType === 'select') {
    let option;
    this.data[requestType].options.forEach(function(e) {
      option = document.createElement('option');
      option.setAttribute('value', e);
      option.innerHTML = e;
      input.appendChild(option);
    });
  }

  // Display input and label
  div.appendChild(label);
  div.appendChild(input);
  dom.appendChild(div);  
};

UI.prototype.data = {
  activeStatus: {
    label: 'Change Supplier to:',
    options: ['Active', 'Inactive']
  },
  supplierType: {
    label: 'Supplier Type:',
    options: [
      'Production (Certified)',
      'Production (Non-Certified)',
      'MRO',
      'Warranty',
      'Employee',
      'Other'
    ]
  },
  nameChange: { label: 'New Name:' },
  remitAddress: { label: 'New Remit Address:' },
  paymentTerms: {
    label: 'Supplier Terms:',
    options: ['Due Upon Receipt', 'N45', 'N30', 'N10']
  },
  paymentType: {
    label: 'Payment Type:',
    options: ['ACH', 'Paymode Check', 'On-Site Check', 'Wire']
  },
  other: { label: 'Change Description:' }
};
//</script>
