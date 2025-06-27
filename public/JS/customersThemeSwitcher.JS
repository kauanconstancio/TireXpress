// theme-switcher.js

document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const modoClaroRadio = document.getElementById('modoClaro');
    const modoEscuroRadio = document.getElementById('modoEscuro');

    // Função para aplicar o tema (a mesma que já temos)
    function applyTheme(theme) {
        if (theme === 'escuro') {
            body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
        }
    }

    // Carrega o tema salvo no localStorage ao carregar a página
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        if (savedTheme === 'dark') {
            // Tenta marcar o rádio se ele existir na página atual
            if (modoEscuroRadio) {
                modoEscuroRadio.checked = true;
            }
            applyTheme('escuro');
        } else {
            // Tenta marcar o rádio se ele existir na página atual
            if (modoClaroRadio) {
                modoClaroRadio.checked = true;
            }
            applyTheme('claro');
        }
    } else {
        // Se não houver tema salvo, define o modo claro como padrão
        // e marca o rádio se ele existir
        if (modoClaroRadio) {
            modoClaroRadio.checked = true;
        }
        applyTheme('claro');
    }

    // Ouve as mudanças nos botões de rádio (se eles existirem na página)
    if (modoClaroRadio && modoEscuroRadio) {
        modoClaroRadio.addEventListener('change', () => applyTheme('claro'));
        modoEscuroRadio.addEventListener('change', () => applyTheme('escuro'));

        // Opcional: Adicionar classe 'active' ao container do botão selecionado
        const radioButtons = document.querySelectorAll('input[name="tema"]');
        radioButtons.forEach(radio => {
            radio.addEventListener('change', function() {
                document.querySelectorAll('.theme-option').forEach(option => {
                    option.classList.remove('active');
                });
                if (this.checked) {
                    this.closest('.theme-option').classList.add('active');
                }
            });

            // Adiciona a classe active no carregamento inicial para o item checado
            if (radio.checked) {
                radio.closest('.theme-option').classList.add('active');
            }
        });
    }
});