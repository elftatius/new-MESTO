import Api from "./Api";
import Popup from "./Popup";
import Card from "./Card";
import CardList from "./CardList";
import CardForm from "./CardForm";
import UserInfo from "./UserInfo";
import FormValidator from "./FormValidator";
import errorMessages from "./errorMessages";
import "../images";


import "./../pages/index.css";

const api = new Api('cohort12', 'd3525b44-ebff-4b8b-a06b-35e2a11a9b34');

const picturePopupTemplate = document.querySelector('#picture-template').content;

const openImagePopup = (imageUrl) => {
  const popup = picturePopupTemplate.cloneNode(true).children[0];
  popup.querySelector('.popup__picture').setAttribute('src', imageUrl);
  picturePopup.renderContent(popup);
  picturePopup.open();
}

const createCard = (card) => {
  return new Card(card, openImagePopup, api);
}

const addCardPopup = new Popup(
  document.querySelector('#add-card-popup'),
  document.querySelector('#add-card-popup-open')
);

const editProfilePopup = new Popup(
  document.querySelector('#edit-profile-popup'),
  document.querySelector('#edit-profile-popup-open')
);

const networkErrorPopup = new Popup(
  document.querySelector('#network-error-popup'),
  undefined
);

api.onNetworkError = () => {
  networkErrorPopup.open();
}

const picturePopup = new Popup(
  document.querySelector('#picture-popup'),
  undefined
);

const cardList = new CardList(document.querySelector('.places-list'));

api.getCards()
  .then(result => {
    const cards = result.map(card => createCard({
      name: card.name,
      link: card.link,
      likes: card.likes,
      ownerId: card.owner._id,
      _id: card._id
    }));
    cardList.addCards(cards);
  })
  .catch((err) => console.log(err));

const cardForm = new CardForm(
  document.querySelector('form[name=add-card]'),
  cardList,
  addCardPopup,
  document.querySelector('#add-card-popup-close'),
  createCard,
  api
);

const userInfo = new UserInfo(
  document.querySelector('.user-info__name'),
  document.querySelector('.user-info__job'),
  document.querySelector('form[name=edit-profile]'),
  editProfilePopup,
  api,
  document.querySelector('.user-info__photo')
);

new FormValidator(document.querySelector('form[name=add-card]'), errorMessages);
new FormValidator(document.querySelector('form[name=edit-profile]'), errorMessages);



