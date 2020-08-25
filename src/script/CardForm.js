export default class CardForm {
  constructor(form, cardList, popup, resetButton, createCard, api) {
    this._form = form;
    this._api = api;
    this._cardList = cardList;
    this._popup = popup;
    this._resetButton = resetButton;
    this._createCard = createCard;
    this._createCard = this._createCard.bind(this);
    this._addEventListeners();
    popup.onClose = this._clearErrors.bind(this);
  }

  _addEventListeners() {
    this._form.addEventListener('submit', this._submit.bind(this));
    this._resetButton.addEventListener('click', this._resetForm.bind(this));
  }

  _submit(event) {
    event.preventDefault();
    const name = this._form.querySelector('input[name=new-place-name]');
    const link = this._form.querySelector('input[name=new-place-link]');
    this._api.postCard(name.value, link.value).then(data => {
      const card = this._createCard({ 
        name: data.name, 
        link: data.link, 
        likes: [], 
        ownerId: localStorage.getItem('userId'),
        _id: data._id
      });
      this._cardList.addCard(card);
    })
    .catch((err) => console.log(err));
    this._popup.close();
    this._resetForm();
  }

  _clearErrors() {
    const msgs = this._form.querySelectorAll('.error-message');
    Array.from(msgs).forEach(msg => msg.textContent = '');
  }

  _resetForm() {
    this._form.reset();
    this._resetSubmitButtonState();
  }

  _resetSubmitButtonState() {
    const btn = this._form.querySelector('.popup__button');
    btn.disabled = true;
    btn.classList.remove('popup__button_active');
  }
}