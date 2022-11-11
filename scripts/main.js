const url = 'https://63642e947b209ece0f424f1d.mockapi.io/';
const btnGet1 = document.querySelector('#btnGet1');
const btnPost = document.querySelector('#btnPost');
const btnPut = document.querySelector('#btnPut');
const btnDelete = document.querySelector('#btnDelete');
const btnSendChanges = document.querySelector('#btnSendChanges');
const results = document.querySelector('#results');


async function getData(url, options = {}) {

  let response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  let data = await response.json();
  console.log(response.statusText)

  if (response.statusText === 'OK') {
    return data;
  } else {
    alert('asd');
    return 'error'; //'error'
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

});

btnPost.addEventListener('click', async () => {
  // POST https://SECRET.mockapi.io/users

  const inputPostNombre = document.querySelector('#inputPostNombre').value;
  const inputPostApellido = document.querySelector('#inputPostApellido').value;

  let usuario = {
    name: inputPostNombre,
    lastname: inputPostApellido,
  }

  await getData(url + '/users', { method: 'POST', body: JSON.stringify(usuario) });

  inputPostNombre.value = "";
  inputPostApellido.value = "";

  btnGet1.click();
  datosCorrectos('nuevo-registro', 'btnPost');
});

btnPut.addEventListener('click', async () => {
  //https://SECRET.mockapi.io/users/:id
  let idItem = document.querySelector("#inputPutId");
  let inputPutApellido = document.querySelector("#inputPutApellido");
  let inputPutNombre = document.querySelector("#inputPutNombre");
  let btnGuardar = document.querySelector("#btnSendChanges");

  if (idItem.value) {
    let item = await getData(url + '/users/' + idItem.value, { method: 'GET' });
    if (item != 'error') {
      inputPutNombre.value = item.name;
      inputPutApellido.value = item.lastname;
      let modal = new bootstrap.Modal(document.getElementById('dataModal'));
      modal.show();

      btnGuardar.addEventListener('click', async () => {
        let usuario = {
          name: inputPutNombre.value,
          lastname: inputPutApellido.value,
        }
        await getData(url + '/users/' + idItem.value, { method: 'PUT', body: JSON.stringify(usuario)});
        btnGet1.click();
      })
    }

  }


});

btnDelete.addEventListener('click', async () => {
  //https://SECRET.mockapi.io/users/:id
  const idDelete = document.querySelector('#inputDelete');
  let item = await getData(url + '/users/' + idDelete.value, { method: 'DELETE' });

  if (item !== 'error') {
    btnGet1.click();
    idDelete.value = "";
    datosCorrectos("eliminar-dato", "btnDelete")
  }
});

const datosCorrectos = (clase, btnId) => {
  let inputs = document.querySelectorAll(`.${clase}`);
  let btn = document.querySelector(`#${btnId}`);
  inputs.forEach((input) => {
    if ((input.value)) {
      if (typeof parseInt(input.value) === 'number' && parseInt(input.value) > 0) {
        btn.removeAttribute('disabled');
      } else if (typeof input.value === 'string' && input.value.trim() !== "") {
        btn.removeAttribute('disabled');
      } else {
        btn.setAttribute('disabled', '');
      }
    } else {
      btn.setAttribute('disabled', '');
    }
  })
};