export default class Popup {
  constructor(container, openButton) {
    this._container = container;
    this._openButton = openButton;
    this._addEventListeners();
  }
  
  open() {
    this._container.classList.add('popup_is-opened');
  }

  close() {
    this._container.classList.remove('popup_is-opened');
    if (this.onClose) {
      this.onClose();
    }
  }

  _addEventListeners() {
    this._container.querySelector('.popup__close').addEventListener('click', this.close.bind(this));

    if (this._openButton === undefined) return;
  
    this._openButton.addEventListener('click', this.open.bind(this));
  }

  renderContent(content) {
    this._container.innerHTML = ''; 
    this._container.append(content);
    this._addEventListeners();
  }
}