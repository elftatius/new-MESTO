class FormValidator {
  constructor(form, errorMessages) {
    this._form = form;
    this._submitButton = form.querySelector('.popup__button');
    this._errorMessages = errorMessages;
    this._addEventListeners();
    this._checkValidity();
  }

  _addEventListeners() {
    Array.from(this._form.elements).forEach(input => {
      input.addEventListener('input', () => {
        this._setSubmitState();
        this._checkInputValidity(input);
      });
    })
  }

  _checkValidity() {
    let isValid = true;
    Array.from(this._form.elements).forEach(function(input){
      if(input.type !== 'submit') {
        if (!input.validity.valid) {
          isValid = false;
        }
      }
    });
    return isValid;
  }

  _setSubmitState() {
    if(this._checkValidity()) {
      this._submitButton.disabled = false;
      this._submitButton.classList.add('popup__button_active');
    }
    else {
      this._submitButton.disabled = true;
      this._submitButton.classList.remove('popup__button_active');
    }
  }

  _checkInputsValidity() {
    Array.from(this._form.elements).forEach(input => {
      if (input.type !== 'submit') {
        this._checkInputValidity(input);
      }
    });
  }

  _checkInputValidity(input) {
    const errorMessage = input.nextElementSibling;
    if(input.validity.valueMissing) {
      errorMessage.textContent = this._errorMessages.empty();
    }
    else if(input.validity.tooShort || input.validity.tooLong) {
      errorMessage.textContent = this._errorMessages.wrongLength(input.getAttribute('minlength'), input.getAttribute('maxlength'));
    }
    else if(input.validity.typeMismatch && input.type === 'url') {
      errorMessage.textContent =  this._errorMessages.wrongUrl();
    }
    else {
      errorMessage.textContent = '';
    }
  }
}