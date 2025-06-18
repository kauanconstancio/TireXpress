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


// const inputFile = document.querySelector('#imageInput');

// const pictureImage = document.querySelector('.picture--image');

// const pictureImageTxt = '<i class="fa-solid fa-plus"></i>Envie uma foto';
// pictureImage.innerHTML = pictureImageTxt


// inputFile.addEventListener('change', function(e) {
//     const inputTarget = e.target;
//     const file = inputTarget.files[0];

//     if (file) {
//         const reader = new FileReader();

//         reader.addEventListener('load', function(e){
//             const readerTarget = e.target;

//             const img = document.createElement('img');

//             img.src = readerTarget.result;
//             img.classList.add('picture__img');

//             pictureImage.innerHTML = '';

//             pictureImage.appendChild(img);
//         });

//         reader.readAsDataURL(file);
//     } else {
//         pictureImage.innerHTML = pictureImageTxt;
//     }
// })