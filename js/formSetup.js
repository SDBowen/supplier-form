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

// Handle form type change
UI.prototype.formTypeChange = function() {
  const formType = document.getElementById('requestType');
  // Reset form
  this.formReset();
  // Display correct options for form type
  if (formType.value === 'newSupplier') {
    this.addFormInput('Supplier Type');
    this.addFormInput('Payment Terms');
  } else {
    const changeType = document.getElementById('changeType');
    this.displayChangeTypeForm();
    this.addFormInput(this.data.changeType.options[0]);
    this.addFormInput('Supplier Number');
  }
};

// Update form for selected change type
UI.prototype.displayChangeTypeForm = function() {
  const header = document.getElementById('headerDiv');
  const div = document.createElement('div');
  div.setAttribute('class', 'form-group col-md-3');
  div.setAttribute('id', 'changeTypeDiv');
  const changeTypeInput = document.createElement('select');
  const changeTypeLabel = document.createElement('label');
  changeTypeLabel.setAttribute('for', 'changeType');
  changeTypeLabel.innerHTML = this.data.changeType.label;

  changeTypeInput.setAttribute('id', 'changeType');
  changeTypeInput.setAttribute('class', 'form-control');
  // If select input add options

  let option1;
  this.data.changeType.options.forEach(function(e) {
    option1 = document.createElement('option');
    option1.setAttribute('value', e);
    option1.innerHTML = e;
    changeTypeInput.appendChild(option1);
  });

  // Display input and label
  div.appendChild(changeTypeLabel);
  div.appendChild(changeTypeInput);
  header.appendChild(div);
  document.getElementById('changeType').addEventListener('change', this.updateFormRequestType, false);
};

UI.prototype.updateFormRequestType = function() {
  const formDetailDiv = document.getElementById('formDetailDiv');  
  while (formDetailDiv.firstChild) {
    formDetailDiv.removeChild(formDetailDiv.firstChild);
  }  
  const userSelectedType = document.getElementById('changeType');
  UI.prototype.addFormInput(userSelectedType.value);
};

UI.prototype.clearFileList = function() {
  const fileList = document.getElementById('fileList');
  // Clear any prior selected files
  while (fileList.firstChild) {
    fileList.removeChild(fileList.firstChild);
  }
};

UI.prototype.formReset = function() {
  const numberDiv = document.getElementById('supplierNumberDiv');
  const typeDiv = document.getElementById('changeTypeDiv');
  const formDetailDiv = document.getElementById('formDetailDiv');
  // Clear any prior selected files
  while (numberDiv.firstChild) {
    numberDiv.removeChild(numberDiv.firstChild);
  }
  while (formDetailDiv.firstChild) {
    formDetailDiv.removeChild(formDetailDiv.firstChild);
  }
  if (typeDiv) {
    typeDiv.remove();
  }
};

UI.prototype.addFormInput = function(requestType) {
  const divId =
    requestType === 'Supplier Number' ? 'supplierNumberDiv' : 'formDetailDiv';
  const dom = document.getElementById(divId);
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
  changeType: {
    label: 'Change Type',
    options: [
      'Active Status',
      'Supplier Type',
      'Name Change',
      'Remit Address',
      'Payment Terms',
      'Payment Type',
      'Other'
    ]
  },
  'Supplier Number': { label: 'Supplier Number' },
  'Active Status': {
    label: 'Change Supplier to:',
    options: ['Active', 'Inactive']
  },
  'Supplier Type': {
    label: 'Supplier Type',
    options: [
      'Production (Certified)',
      'Production (Non-Certified)',
      'MRO',
      'Warranty',
      'Employee',
      'Other'
    ]
  },
  'Name Change': { label: 'New Name' },
  'Remit Address': { label: 'New Remit Address' },
  'Payment Terms': {
    label: 'Supplier Terms:',
    options: ['Due Upon Receipt', 'N45', 'N30', 'N10']
  },
  'Payment Type': {
    label: 'Payment Type:',
    options: ['ACH', 'Paymode Check', 'On-Site Check', 'Wire']
  },
  Other: { label: 'Change Description' }
};
//</script>
