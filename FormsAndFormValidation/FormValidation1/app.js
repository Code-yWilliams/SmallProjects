document.addEventListener('DOMContentLoaded', function(e) {
  const formErrorsParagraph = document.querySelector('.form-errors');
  let formFields = document.querySelectorAll('input');

  let nameFields = document.querySelectorAll('input[name="first-name"], input[name="last-name"]')
  nameFields.forEach(field => field.addEventListener('keypress', function(e) {
    let key = e.key;
    if (!/[a-zA-Z\s']/.test(key)) {
      e.preventDefault();
    }
  }));

  let numberFields = document.querySelectorAll('.digits-only')
  numberFields.forEach(field => field.addEventListener('keypress', function(e) {
    let key = e.key;
    if (!/[\d-]/.test(key)) {
      e.preventDefault();
    }
  }));

  let creditCardFields = Array.from(document.querySelectorAll('#credit-card-input-container input'));
  creditCardFields.slice(0, 3).forEach(field => field.addEventListener('keyup', function(e) {
    if (e.target.value.length === Number(e.target.getAttribute('maxlength'))) {
      let nextCreditCardField = e.target.nextElementSibling;
      nextCreditCardField.focus();
    }
  }));

  formFields.forEach(field => field.addEventListener('focus', function(e) {
    field.classList.remove('invalid-field')
    clearInputErrorMessage(field);
  }));

  formFields.forEach(field => field.addEventListener('blur', function(e) {
    let inputElement = e.target;
    validateInput(inputElement);
  }));

  function validateInput(inputElement) {
    let errorMessage = null;
    errorMessage = getErrorMessage(inputElement);

    if (errorMessage !== null) {
      inputElement.classList.remove('invalid-field');
      inputElement.classList.add('invalid-field');

      setInputErrorMessage(inputElement, errorMessage);
    }
  }

  function patternMismatch(inputElement) {
    return inputElement.validity.patternMismatch;
  }

  function valueMissing(inputElement) {
    return inputElement.validity.valueMissing;
  }

  function getErrorMessage(inputElement) {
    let inputName = inputElement.name
    let label = document.querySelector(`label[for='${inputName}'`);
    let labelName = label.textContent;

    if (valueMissing(inputElement)) {
      return `${labelName} is required.`
    } else if (patternMismatch(inputElement) && labelName === 'Password') {
      return 'Password must be 10 or more characters.';
    } else if (patternMismatch(inputElement) && labelName === 'Phone Number') {
      return 'Please use this format: XXX-XXX-XXXX';
    } else if (patternMismatch(inputElement) && labelName === 'Credit Card Number') {
      return 'All Credit Card fields require 4 digits.';
    } else if (patternMismatch(inputElement)) {
      return `Please enter a valid ${labelName}`;
    } else {
      return null;
    }
  }

  function setInputErrorMessage(inputElement, message) {
    let errorMessageSpan = inputElement.parentElement.querySelector('.error-message');
    errorMessageSpan.textContent = message;
  }

  function clearInputErrorMessage(inputElement) {
    let errorMessageSpan = inputElement.parentElement.querySelector('.error-message');
    errorMessageSpan.textContent = '';
  }

  function setFormErrorsParagraph() {
    formErrorsParagraph.textContent = 'Please correct all inputs before submitting the form.'
  }

  document.querySelector('.signup-form').addEventListener('submit', function(e) {
    e.preventDefault();

    formFields.forEach(field => field.dispatchEvent(new Event('blur')));
    let inputErrors = document.querySelectorAll('.invalid-field');
    if (inputErrors.length > 0) {
      setFormErrorsParagraph();
    } else {
      submitForm()
    }
  });

  function submitForm() {
    const form = document.querySelector('.signup-form');
    let formData = new FormData(form);
    let formDataArray = [...formData.entries()];
    let data = {};
    formDataArray.forEach(subArray => {
      data[subArray[0]] = data[subArray[0]] || '';
      data[subArray[0]] += subArray[1];
    });
    let queryString = dataObjToQueryString(data);
    renderSerializedFormData(queryString);
  }

  function dataObjToQueryString(data) {
    let dataEntries = Object.entries(data);
    dataEntries = dataEntries.map(entry => {
      let key = encodeURIComponent(entry[0]);
      let value = encodeURIComponent(entry[1]);
      return `${key}=${value}`;
    });
    return dataEntries.join('&');
  }

  function renderSerializedFormData(queryString) {
    let dataContainer = document.querySelector('#serialized-data-container');
    let wrapper = document.createElement('div');
    let newTextNode = document.createTextNode(queryString);
    wrapper.appendChild(newTextNode);
    wrapper.classList.add('serialized-data-wrapper');
    dataContainer.appendChild(wrapper);
  }
});