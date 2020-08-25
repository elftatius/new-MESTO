export default class Api {
  static endpoint = "https://nomoreparties.co";

  constructor(cohortId, token) {
    this._cohortId = cohortId;
    this._token = token;
  }


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

    
    .catch(err => {
      console.log(err);
      if (this.onNetworkError) {
        this.onNetworkError();
      }
      return Promise.reject(err); 
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
        return Promise.reject(err); 
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
        return Promise.reject(err); 
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
        return Promise.reject(err); 
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
        return Promise.reject(err); 
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
        return Promise.reject(err); 
      })
    );
  }
}