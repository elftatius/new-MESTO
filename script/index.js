(function () {
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
})();


/*REVIEW. Резюме.

Неплохая работа. Сделано дополнительное задание по установке и снятию лайка на карточке, меняется название кнопки сабмита при запросе к серверу,
но требуется доработка проекта.


Что нужно исправить.

1. Нужно изменить структуру методов класса Api и структуру цепочки промисов, которая обрабатывает ответ сервера
(подробный комментарий и образец в файле класса Api). +

2. Обращаться второй раз к серверу после получения ответа от сервера с помощью метода api.patchUser ни к чему, это может только замедлить выполнение
приложения (подробный комментарий в файле класса UserInfo). +

3. При добавлении новой карточки, она появляется на экране без иконки удаления и её невозможно сразу удалить. Надо это исправить. +


_____________________________________________________________________________________________________________________________________________
REVIEW2. Резюме2.

Пункт 2 и частично пункт 1 из резюме предыдущей проверки выполнены.

Что надо исправить.

1. Не добавлен блок .catch((err) => {console.log(err);}) к цепочке промисов, находящейся вне класса Api, то есть эта цепочка не приведена к нужному виду:
api.methodApi(параметры).then(обработка ответа силами методов других классов).catch((err) => {console.log(err);}),
где должен обязательно находиться блок .catch(...) после последнего метода then (необходимость этого была объяснена при первой проверке).

Привожу объяснения кщё раз:

В метод catch могут попасть ошибки, произошедшие в методах .then, находящихся в цепочке до этого .catch (https://learn.javascript.ru/promise-error-handling),
поэтому, если у Вас нет блока .catch после последнего метода .then, в котором обрабатывается объект, который вернул сервер в своём ответе, могут никак не
обработаться ошибки Вашего приложения, которые могут содержаться в методах классов, которые вызываются для обработки ответа.

А также, что случается ещё чаще, никак не обработается ситуация, когда запрос, вроде бы, был успешен и сервер вернул статус 200, но объект, возвращённый
сервером оказался пустым, или не того формата, который ожидает Ваше приложение. Тогда при обработке такого ответа (а он обязательно начнёт обрабатываться
в методе api.methodApi(параметры).then(обработка ответа силами методов других классов), так как от сервера пришёл статуса успеха 200) могут возникнуть
синтаксические ошибки, которые также должны обнаружаться и обработаются в последнем блоке .catch, если он, конечно, есть, но у Вас его нет.

Поэтому структуру цепочки промисов, в которой обрабатываются ответы сервера надо привести в нужный вид.

Необходимо также вникнуть в комментарии, находящиеся в файле класса Api (в том числе в новый).


2. Теперь на вновь введённой карточке из формы карточки, иконка удаления появляется, но не появляется картинка, карточка предстаёт на экране пустой,
картинка появляется только после перезагрузки страницы. Исправьте это и протестируйте работоспособность всех функций проекта, как и положено перед ревью.


_____________________________________________________________________________________________________________________________________________
REVIEW3. Резюме3.

Неточности исправлены.

Обратите внимание на комментарий в файле класса Api, где я объяснила ещё одну тонкость обработки ошибок при работе с сервером,
о которой забыла Вам сказать при прошлой проверке.

Задание принимается.

Желаю успехов в дальнейшей учёбе!



*/