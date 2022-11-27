const container = document.querySelector('main');
const popupBlock = document.querySelector('.popup-wrapper');
const popupAdd = popupBlock.querySelector('.popup-add');
const popupUpd = popupBlock.querySelector('.popup-upd');
const addForm = document.forms.addForm;
const updForm = document.forms.updForm;

let user = 'kadilov';

popupBlock.querySelectorAll('.popup__close').forEach(function (btn) {
  btn.addEventListener('click', function () {
    popupBlock.classList.remove('active');
    btn.parentElement.classList.remove('active');
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

  const img = document.createElement('div');
  img.className = 'card-pic';
  if (cat.img_link) {
    img.style.backgroundImage = `url(${cat.img_link})`
  } else {
    img.style.backgroundImage = 'url(https://i.imgur.com/Vj5PXtY.png)';
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
  })

  card.append(img, name, del, upd);
  parent.append(card);
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











