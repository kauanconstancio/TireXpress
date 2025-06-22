document.addEventListener('DOMContentLoaded', () => {
    // --- LÓGICA PARA PRÉ-VISUALIZAÇÃO DA FOTO ---
    const inputFile = document.querySelector(".imageInput");
    const pictureImage = document.querySelector(".picture__image");
    const pictureImageTxt = '<i class="fa-solid fa-plus"></i>Envie uma foto';

    // Garante que os elementos existem antes de adicionar os listeners
    if (inputFile && pictureImage) {
        pictureImage.innerHTML = pictureImageTxt;

        inputFile.addEventListener("change", function (e) {
            const file = e.target.files[0];

            if (file) {
                // Melhoria: Validar se o arquivo é uma imagem
                if (!file.type.startsWith('image/')) {
                    alert('Por favor, selecione um arquivo de imagem.');
                    inputFile.value = ""; // Limpa a seleção
                    pictureImage.innerHTML = pictureImageTxt;
                    return;
                }

                const reader = new FileReader();

                reader.addEventListener("load", function (e) {
                    const img = document.createElement("img");
                    img.src = e.target.result;
                    img.classList.add("picture__img");

                    pictureImage.innerHTML = "";
                    pictureImage.appendChild(img);
                });

                reader.readAsDataURL(file);
            } else {
                pictureImage.innerHTML = pictureImageTxt;
            }
        });
    }

    // --- LÓGICA PARA REQUISIÇÃO DE CADASTRO ---
    const formCadastro = document.getElementById('formCadastro');

    if (formCadastro) {
        formCadastro.addEventListener('submit', async (e) => {
            e.preventDefault(); // Evita que a página recarregue

            // O FormData já pega todos os campos, incluindo o input de arquivo.
            const formData = new FormData(formCadastro);

            try {
                // Para enviar arquivos, envie o objeto FormData diretamente.
                // NÃO defina o header 'Content-Type'. O browser fará isso
                // automaticamente com o boundary correto para multipart/form-data.
                const response = await fetch('/cadastro', {
                    method: 'POST',
                    body: formData // Envia o formulário completo
                });

                // Verifica se a resposta do servidor foi bem-sucedida (status 2xx)
                if (response.ok) {
                    const result = await response.text();
                    console.log('Resposta do servidor:', result);
                    alert('Cadastro feito com sucesso!');
                    // Opcional: Limpar o formulário após o sucesso
                    formCadastro.reset();
                    pictureImage.innerHTML = pictureImageTxt;
                } else {
                    // Se o servidor respondeu com um erro (ex: 400, 404, 500)
                    const errorText = await response.text();
                    console.error('Erro do servidor:', response.status, errorText);
                    alert(`Erro ao cadastrar: ${errorText || response.statusText}`);
                }
            } catch (err) {
                // Este bloco pega erros de rede (ex: sem internet)
                console.error('Erro na requisição:', err);
                alert('Erro de conexão ao tentar cadastrar. Tente novamente.');
            }
        });
    }
});