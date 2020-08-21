class Api {
  static endpoint = "https://praktikum.tk";

  constructor(cohortId, token) {
    this._cohortId = cohortId;
    this._token = token;
  }

  /*REVIEW.Нужно исправить. Структура всех методов класса Api должна быть следующей:

methodApi = (...) => {
  return fetch(`...`, {
     ...
    })
    .then(res => {
      if (!res.ok) {
        return Promise.reject(res.status);
      } else {
        return res.json();
      }
    })
}
То есть после проверки, в каком диапазоне находится HTTP-статус ответа сервера (если в диапазото res.ok === true, иначе res.ok === false,
https://learn.javascript.ru/fetch) должно быть  возвращение Promise.reject(res.status), так как  в случае неуспешного запроса и ответа,
в вашем блоке catch не сможет быть обнаружена ситуация неуспешности запроса, так как блок catch может обнаружить только объект ошибки,
если он каким-либо образом создаётся. Так как сервер всегда в методе fetch возвращает объект ответа, а не ошибки, в случае неуспешного
ответа и нужно вызвать метод Promise.reject(res.status), который и вернёт объект ошибки со статусом res.status, который и сможет быть
обнаружен и обработан в catch.
Так же блок catch методы класса Api могут не содержать, так как метод catch должен быть последним в цепочке промисов, потому что только тогда блок catch может
обнаружить все ошибки (и сети, и серверные, и клиентского приложения). Об этом подробно можно прочитать здесь:
https://learn.javascript.ru/promise-error-handling.

Поэтому блок catch нужно поместить после метода .then обработки ответа от сервера, которую Вы правильно осуществляете в файлах объявления других классов
и в файле-точке входа проекта.

То есть структура вызова преобразованного метода Api и обработки результата ответа должна быть такой:
api.methodApi(параметры).then(обработка ответа силами методов других классов).catch(...);
*/
  get(uri) {
    return (fetch(`${Api.endpoint}/${this._cohortId}/${uri}`, {
      headers: {
        authorization: this._token
      }
    })
    .then(res => {
      if (!res.ok) {
        return Promise.reject(res.status);
      } else {
        return res.json();
      }
    }))

    /*REVIEW3. Теперь Вы правильно добавили блок .catch в конец цепочки промисов, но я забыа Вам написать в прошлый раз, что если Вы оставите блок .catch
    в середине цепочки, то надо сделать так, чтобы этот блок возвращал объект ошибки, чтобы она попала в последний блок .catch и цепочка промисов перестала
    бы выполняться. Иначе, если произойдёт ошибка в блоках .then, которые расположены до .catch, который расположен по середине цепочки, то эта ошибка в
    этом блоке .catch обнаружится, но если этот блок не вернёт объект ошибки наружу, то начнут выполняться следующие за ним методы then, обрабатывая неправильные
    результаты. Поэтому, либо вообще не надо определять блок .catch в середине цепочки, а только в конце её (тогда все ошибки будут попадать в конечный блок
    .catch и никакие блоки .then уже не будут выполняться после ошибки), либо срединный блок .catch должен возвращать ошибку (Вызов Вашего метода onNetworkError
    надо поместить в конечный .catch):
     */
    .catch(err => {
      console.log(err);
      if (this.onNetworkError) {
        this.onNetworkError();
      }
      return Promise.reject(err); //REVIEW3.
    });

  }

  getUser() {
    return this.get('users/me');
  }

  getCards() {
   return this.get('cards');
  }

  patchUser(name, about) {
    return(
      fetch(`${Api.endpoint}/${this._cohortId}/users/me`, {
        method: 'PATCH',
        headers: {
          authorization: this._token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          about: about
        })
      })
      .then(res => {
        if (!res.ok) {
          return Promise.reject(res.status);
        } else {
          return res.json();
        }
      })
      .catch(err => {
        console.log(err);
        if (this.onNetworkError) {
          this.onNetworkError();
        }
        return Promise.reject(err); //REVIEW3.
      })
    );
  }

  postCard(name, link) {
    return(
      fetch(`${Api.endpoint}/${this._cohortId}/cards`, {
        method: 'POST',
        headers: {
          authorization: this._token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          link: link
        })
      })
      .then(res => {
        if (!res.ok) {
          return Promise.reject(res.status);
        } else {
          return res.json();
        }
      })
      .catch(err => {
        console.log(err);
        if (this.onNetworkError) {
          this.onNetworkError();
        }
        return Promise.reject(err); //REVIEW3.
      })

    );
  }

  deleteCard(id) {
    return (
      fetch(`${Api.endpoint}/${this._cohortId}/cards/${id}`, {
        method: 'DELETE',
        headers: {
          authorization: this._token,
          'Content-Type': 'application/json'
        }
      })
      .then(res => {
        if (!res.ok) {
          return Promise.reject(res.status);
        } else {
          return res.json();
        }
      })
      .catch(err => {
        console.log(err);
        if (this.onNetworkError) {
          this.onNetworkError();
        }
        return Promise.reject(err); //REVIEW3.
      })
    );
  }

  likeCard(id) {
    return(
      fetch(`${Api.endpoint}/${this._cohortId}/cards/like/${id}`, {
        method: 'PUT',
        headers: {
          authorization: this._token,
          'Content-Type': 'application/json'
        }
      })
      .then(res => {
        if (!res.ok) {
          return Promise.reject(res.status);
        } else {
          return res.json();
        }
      })
      .catch(err => {
        console.log(err);
        if (this.onNetworkError) {
          this.onNetworkError();
        }
        return Promise.reject(err); //REVIEW3.
      })
    );
  }

  unlikeCard(id) {
    return(
      fetch(`${Api.endpoint}/${this._cohortId}/cards/like/${id}`, {
        method: 'DELETE',
        headers: {
          authorization: this._token,
          'Content-Type': 'application/json'
        }
      })
      .then(res => {
        if (!res.ok) {
          return Promise.reject(res.status);
        } else {
          return res.json();
        }
      })
      .catch(err => {
        console.log(err);
        if (this.onNetworkError) {
          this.onNetworkError();
        }
        return Promise.reject(err); //REVIEW3.
      })
    );
  }
}