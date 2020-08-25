export default class UserInfo {
  constructor(nameContainer, descriptionContainer, form, popup, api, photoBox) {
    this._nameContainer = nameContainer;
    this._descriptionContainer = descriptionContainer;
    this._form = form;
    this._popup = popup;
    this._nameInput = form.querySelector('input[name=edit-profile-name]');
    this._descriptionInput = form.querySelector('input[name=edit-profile-description]');
    this._submitButton = form.querySelector('.popup__button');
    this._handleSubmit = this._handleSubmit.bind(this);
    this._api = api;
    this._photoBox = photoBox;
    this.fetchUser();
    this._addEventListeners();
    this._setFormInputs();


    popup.onClose = this._setFormInputs.bind(this);


  }


  fetchUser() {
    this._api.getUser()
    .then(result => {
      this.setUserInfo(result.name, result.about, result._id);
      this._updateUserInfo();
      this._updateAvatar(result.avatar);
      this._setFormInputs();
      this._saveIdToLocalStorage();

    })
    .catch((err) => console.log(err));
  }

  setUserInfo(name, description, id) {
    this._name = name;
    this._description = description;
    this._id = id;
  }

  _updateUserInfo() {
    this._nameContainer.textContent = this._name;
    this._descriptionContainer.textContent = this._description;
  }

  _updateAvatar(avatarUrl) {
    this._photoBox.style.backgroundImage = `url(${avatarUrl})`;
  }

  _setFormInputs() {
    this._nameInput.value = this._nameContainer.textContent;
    this._descriptionInput.value = this._descriptionContainer.textContent;
    this._clearErrors();
  }

  _clearErrors() {
    const msgs = this._form.querySelectorAll('.error-message');
    Array.from(msgs).forEach(msg => msg.textContent = '');
  }

  _handleSubmit(event) {
    event.preventDefault();
    this._submitButton.textContent = 'Загрузка...';
    this._submitButton.disabled = true;
    this._api.patchUser(this._nameInput.value, this._descriptionInput.value).then(data => {
      this.setUserInfo(data.name, data.about, data._id);
      this._updateUserInfo();
      this._popup.close();
      this._submitButton.textContent = 'Сохранить';
      this._submitButton.disabled = false;
    })
    .catch((err) => console.log(err));
  }

  _addEventListeners() {
    this._form.addEventListener('submit', event => this._handleSubmit(event));
  }

  _saveIdToLocalStorage() {
    localStorage.setItem('userId', this._id);
  }
}