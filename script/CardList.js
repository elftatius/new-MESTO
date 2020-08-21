class CardList {
  constructor(container) {
    this._container = container;
  }

  addCards(cards) {
    cards.forEach(card => {
      this.addCard(card);
    });
  }

  addCard(card) {
    const element = card.createElement();
    this._container.append(element);
  }
}