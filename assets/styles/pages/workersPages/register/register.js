//Função de adicionar foto
function foto(){
const inputFile = document.querySelector(".imageInput");
const pictureImage = document.querySelector(".picture__image");
const pictureImageTxt = '<i class="fa-solid fa-plus"></i>Envie uma foto';
pictureImage.innerHTML = pictureImageTxt;

inputFile.addEventListener("change", function (e) {
  const inputTarget = e.target;
  const file = inputTarget.files[0];

  if (file) {
    const reader = new FileReader();

    reader.addEventListener("load", function (e) {
      const readerTarget = e.target;

      const img = document.createElement("img");
      img.src = readerTarget.result;
      img.classList.add("picture__img");

      pictureImage.innerHTML = "";
      pictureImage.appendChild(img);
    });

    reader.readAsDataURL(file);
  } else {
    pictureImage.innerHTML = pictureImageTxt;
  }
});

console.log('Hello World')
};


//Fazendo uma Requisição Para a Rota Cadastro.
function requisicao(){
document.getElementById('formCadastro').addEventListener('submit', async (e) => {
  e.preventDefault(); // Evita que a página recarregue

  const form = e.target;
  const formData = new FormData(form);

  const data = Object.fromEntries(formData.entries());

  try {
    const response = await fetch('/cadastro', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const result = await response.text();
    console.log('Resposta do servidor:', result);
    alert('Cadastro feito com sucesso!');
  } catch (err) {
    console.error('Erro no cadastro:', err);
    alert('Erro ao cadastrar');
  }
});
};