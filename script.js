const container = document.querySelector('main');
const popupBlock = document.querySelector('.popup-wrapper');
const popupAdd = popupBlock.querySelector('.popup-add');
const popupUpd = popupBlock.querySelector('.popup-upd');
const addForm = document.forms.addForm;
const updForm = document.forms.updForm;
const cards = document.getElementsByClassName('card');

let user = 'kadilov';

popupBlock.querySelectorAll('.popup__close').forEach(function (btn) {
  btn.addEventListener('click', function () {
    popupBlock.classList.remove('active');
    btn.parentElement.classList.remove('active');
    if (btn.parentElement.classList.contains('popup-upd')) {
      updForm.dataset.id = '';
    }
  });
});

document.querySelector('#add').addEventListener('click',
  function (e) {
    e.preventDefault();
    popupBlock.classList.add('active');
    popupAdd.classList.add('active');
  });


const createCard = function (cat, parent) {
  const card = document.createElement('div');
  card.className = 'card';
  card.dataset.id = cat.id;

  const img = document.createElement('div');
  img.className = 'card-pic';
  if (cat.img_link) {
    img.style.backgroundImage = `url(${cat.img_link})`
  } else {
    img.style.backgroundImage = 'url(img/default.png)';
    img.style.backgroundSize = 'contain';
    img.style.backgroundColor = 'transparent';
  }

  const name = document.createElement('h3');
  name.innerText = cat.name;

  const del = document.createElement('button');
  del.innerText = 'Удалить';
  del.id = cat.id;
  del.addEventListener('click', function (e) {
    let id = e.target.id;
    deleteCat(id, card);
  });

  const upd = document.createElement('button');
  upd.innerText = 'Изменить';
  upd.addEventListener('click', function (e) {
    popupUpd.classList.add('active');
    popupBlock.classList.add('active');
    showForm(cat);
    updForm.setAttribute('data-id', cat.id)
  })

  card.append(img, name, del, upd);
  parent.append(card);
}

const showForm = function (data) {
  for (let i = 0; i < updForm.elements.length; i++) {
    let el = updForm.elements[i];
    if (el.name) {
      if (el.type !== 'checkbox') {
        el.value = data[el.name] ? data[el.name] : '';
      } else {
        el.checked = data[el.name];
      }
    }
  }
}


fetch(`https://sb-cats.herokuapp.com/api/2/${user}/show/`)
  .then(res => res.json())
  .then(result => {
    //console.log(result);
    if (result.message === 'ok') {
      // console.log(result.data[0]);
      result.data.forEach(element => {
        createCard(element, container);
      });
    }
  });

const addCat = function (cat) {
  fetch(`https://sb-cats.herokuapp.com/api/2/${user}/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(cat),
  })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      if (data.message === 'ok') {
        createCard(cat, container);
        addForm.reset();
        popupBlock.classList.remove('active');
      }
    });
};

const deleteCat = function (id, tag) {
  fetch(`https://sb-cats.herokuapp.com/api/2/${user}/delete/${id}`, {
    method: 'DELETE',
  })
    .then(res => res.json())
    .then(data => {
      if (data.message === 'ok') {
        tag.remove();
      }
    })
};

addForm.addEventListener('submit', function (e) {
  e.preventDefault();
  let body = {};

  for (let i = 0; i < addForm.elements.length; i++) {
    let el = addForm.elements[i];
    if (el.name) {
      body[el.name] = el.name === 'favourite' ? el.checked : el.value;
    }
  }

  addCat(body);
});

updForm.addEventListener('submit', function (e) {
  e.preventDefault();
  let body = {};

  for (let i = 0; i < this.elements.length; i++) {
    let el = this.elements[i];
    if (el.name) {
      body[el.name] = el.name === 'favourite' ? el.checked : el.value;
    }
  }

  delete body.id;
  updCat(body, updForm.dataset.id);
});

const updCat = async function (obj, id) {
  let res = await
      fetch(`https://sb-cats.herokuapp.com/api/2/${user}/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj),
      });

  let answer = await res.json();  

  if (answer.message == 'ok') {
    updCard(obj, id);
    updForm.reset();
    updForm.dataset.id = '';
    popupUpd.classList.remove('active');
    popupBlock.classList.remove('active');
  }
};

const updCard = function(data, id) {
  for (let i = 0; index < cards.length; i++) {
    let card = cards[i];
    if (card.dataset.id === id) {
      card.firstElementChild.style.backgroundImage = 
          data.img_link ? `url(${data.img_link})` : 'url(img/default.png)';
          card.querySelector('h3').innerText = data.name || 'noname';
    }
    
  }
}





