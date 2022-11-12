const url = 'https://63642e947b209ece0f424f1d.mockapi.io/';
const btnGet1 = document.querySelector('#btnGet1');
const btnPost = document.querySelector('#btnPost');
const btnPut = document.querySelector('#btnPut');
const btnDelete = document.querySelector('#btnDelete');
const btnSendChanges = document.querySelector('#btnSendChanges');
const results = document.querySelector('#results');
let btnGuardar = document.querySelector("#btnSendChanges");
let idItem = document.querySelector("#inputPutId");
let inputPutApellido = document.querySelector("#inputPutApellido");
let inputPutNombre = document.querySelector("#inputPutNombre");


async function getData(url, options = {}) {

  let response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  let data = await response.json();
  console.log(response.status);
  if (response.status > 199 && response.status < 300) {
    return data;
  } else {
    document.getElementById("errorAlert").classList.add("show");
    setTimeout(function () {
      document.getElementById("errorAlert").classList.remove("show");
    }, 3000);
    return 'error';
  }


}

btnGet1.addEventListener('click', async () => {
  //GET https://SECRET.mockapi.io/users/id
  const inputGet1Id = document.querySelector('#inputGet1Id');


  let info = await getData(url + 'users/' + inputGet1Id.value, { method: 'GET' });

  if (info != 'error') {
    if (inputGet1Id.value) {
      results.innerHTML = `
        <li> ID: ${info.id} <br>
            Name: ${info.name}  <br>
            LASTNAME: ${info.lastname} 
        </li>
    `
    } else {
      let agregar = '';
      info.forEach((user) => {
        agregar += `
            <li> ID: ${user.id} <br>
                 Name: ${user.name}  <br>
                 LASTNAME: ${user.lastname} 
            </li>
          `
      })
      results.innerHTML = agregar;
    }
  }

  inputGet1Id.value = "";

});

btnPost.addEventListener('click', async () => {
  // POST https://SECRET.mockapi.io/users

  const inputPostNombre = document.querySelector('#inputPostNombre');
  const inputPostApellido = document.querySelector('#inputPostApellido');

  let nuevoUs = {
    name: inputPostNombre.value,
    lastname: inputPostApellido.value,
  }

  let item = await getData(url + 'users', { method: 'POST', body: JSON.stringify(nuevoUs) });

  if (item != 'error') {
    inputPostNombre.value = "";
    inputPostApellido.value = "";

    btnGet1.click();
    datosCorrectos('nuevo-registro', 'btnPost');
  }
});

let itemPut = {};
btnPut.addEventListener('click', async () => {
  //https://SECRET.mockapi.io/users/:id
  itemPut = await getData(url + 'users/' + idItem.value, { method: 'GET' });
  if (itemPut != 'error') {
    inputPutNombre.value = itemPut.name;
    inputPutApellido.value = itemPut.lastname;
    let modal = new bootstrap.Modal(document.getElementById('dataModal'));
    modal.show();
  }

  idItem.value = "";
  datosCorrectos('modificar-dato', 'btnPut')

});

btnGuardar.addEventListener('click', async () => {
  let usuario = {
    name: inputPutNombre.value,
    lastname: inputPutApellido.value,
  }
  console.log(usuario);
  let item2 = await getData(url + 'users/' + itemPut.id, { method: 'PUT', body: JSON.stringify(usuario) });
  if(item2 != 'error'){
    btnGet1.click();
    usuario = "";
    inputPutApellido.value = "";
    inputPutNombre.value = "";
  }
})

btnDelete.addEventListener('click', async () => {
  //https://SECRET.mockapi.io/users/:id
  const idDelete = document.querySelector('#inputDelete');
  let item = await getData(url + 'users/' + idDelete.value, { method: 'DELETE' });

  if (item !== 'error') {
    btnGet1.click();
    idDelete.value = "";
    datosCorrectos("eliminar-dato", "btnDelete")
  }
});

const datosCorrectos = (clase, btnId) => {
  let inputs = Array.from(document.querySelectorAll(`.${clase}`));
  let btn = document.querySelector(`#${btnId}`);

  let cumplen = inputs.every((input) => {
    return ((input.value) && (input.value.trim() !== ""));
  });

  if (cumplen) {
    btn.removeAttribute('disabled');
  } else {
    btn.setAttribute('disabled', '');
  }
};