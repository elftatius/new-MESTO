export default class Card {
  static _template = document.querySelector('#card-template').content;

  constructor({ name, link, likes, ownerId, _id }, openImageCallback, api) {
    this._name = name;
    this._link = link;
    this._likes = likes;
    this._id = _id;
    this._ownerId = ownerId;
    this._api = api;
    this.openImageCallback = openImageCallback;
    this._openPopupPicture = this._openPopupPicture.bind(this);
    this._toggleLike = this._toggleLike.bind(this);
    this._remove = this._remove.bind(this);
  }

  createElement() {
    const element = Card._template.cloneNode(true).children[0];
    element.querySelector('.place-card__name').textContent = this._name;
    element.querySelector('.place-card__image').setAttribute('style', `background-image: url(${this._link});`);
    element.querySelector('.place-card__like-counter').textContent = this._likes.length;
    this.addEventListeners(element);
    if(localStorage.getItem('userId') !== this._ownerId) {
      element.querySelector('.place-card__delete-icon').remove();
    }

    if(this._likes.map(like => like._id).includes(localStorage.getItem('userId'))) {
      element.querySelector('.place-card__like-icon').classList.add('place-card__like-icon_liked');
    }
    return element
  }

  addEventListeners(element) {
    element.querySelector('.place-card__like-icon').addEventListener('click', this._toggleLike);
    element.querySelector('.place-card__delete-icon').addEventListener('click', this._remove);
    element.querySelector('.place-card__image').addEventListener('click', this._openPopupPicture);
  }

  _removeEventListeners(element) {
    element.querySelector('.place-card__like-icon').removeEventListener('click', this._toggleLike);
    element.querySelector('.place-card__delete-icon').removeEventListener('click', this._remove);
    element.querySelector('.place-card__image').removeEventListener('click', this._openPopupPicture);
  }

  _toggleLike(event) {
    event.preventDefault();
    event.target.classList.toggle('place-card__like-icon_liked');
    const likesQtyContainer = event.target.closest('.place-card').querySelector('.place-card__like-counter');

    if(event.target.classList.contains('place-card__like-icon_liked')) {
      likesQtyContainer.textContent = parseInt(likesQtyContainer.textContent, 10) + 1;
      this._api.likeCard(this._id).catch((err) => console.log(err));

    }
    else {
      likesQtyContainer.textContent = parseInt(likesQtyContainer.textContent, 10) - 1;
      this._api.unlikeCard(this._id).catch((err) => console.log(err));
    }
  }

  _remove(event) {
    event.preventDefault();
    event.stopPropagation();
    if(localStorage.getItem('userId') === this._ownerId){
      if(window.confirm('вы уверены, что хотите удалить карточку?')) {
        const card = event.target.closest('.place-card')
        this._removeEventListeners(card);
        card.remove();
        this._api.deleteCard(this._id).catch((err) => console.log(err));
      }
    }
  }

  _openPopupPicture() {
    this.openImageCallback(this._link);
  }
}