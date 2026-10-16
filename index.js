function openModal(modalId) {
    document.getElementById(modalId).style.display = "flex";
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = "none";
}
window.onclick = function(event) {
    const modals = document.getElementsByClassName("modal-auto-gestao");
    for (let i = 0; i < modals.length; i++) {
        if (event.target == modals[i]) {
            modals[i].style.display = "none";
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetch('/username')
        .then(response => response.json())
        .then(data => {
            document.getElementById('user-button').textContent = `Olá, ${data.username}`;
        })
        .catch(error => {
            console.error('Erro ao carregar o nome do usuário:', error);
            document.getElementById('user-button').textContent = 'Erro ao carregar nome';
        });

    document.getElementById('user-button').addEventListener('click', () => {
        const userMenu = document.getElementById('user-menu');
        userMenu.classList.toggle('show');
    });

    document.getElementById('logout-link').addEventListener('click', (event) => {
        event.preventDefault();
        fetch('/logout')
            .then(response => {
                if (response.redirected) {
                    window.location.href = response.url;
                }
            })
            .catch(error => {
                console.error('Erro ao fazer logout:', error);
            });
    });

    window.addEventListener('click', (event) => {
        const userMenu = document.getElementById('user-menu');
        if (!userMenu.contains(event.target) && userMenu.classList.contains('show')) {
            userMenu.classList.remove('show');
        }
    });
});

function openConfig(configType) {
    var modal = document.getElementById('modal-' + configType);
    if (modal) {
        if (configType === 'informacoesPessoais') {
            fetch('/api/informacoes-pessoais')
                .then(response => response.json())
                .then(data => {
                    document.getElementById('userName').textContent = data.nome;
                    document.getElementById('userEmail').textContent = data.email;
                })
                .catch(error => console.error('Erro:', error));
        }
        modal.style.display = 'block';
    }
}

function closeConfig(configType) {
    var modal = document.getElementById('modal-' + configType);
    if (modal) {
        modal.style.display = 'none';
    }
}

window.onclick = function(event) {
    var modals = document.getElementsByClassName('modal');
    for (var i = 0; i < modals.length; i++) {
        if (event.target === modals[i]) {
            modals[i].style.display = 'none';
        }
    }
}
        document.addEventListener('DOMContentLoaded', (event) => {
    // Função para abrir o modal
    document.getElementById('openUpdatePasswordModal').addEventListener('click', function() {
        document.getElementById('update-password-modal').style.display = 'block';
    });

    // Função para fechar o modal ao clicar no "x"
    document.getElementById('update-password-close').addEventListener('click', function() {
        document.getElementById('update-password-modal').style.display = 'none';
    });

    // Fechar o modal ao clicar fora da área de conteúdo
    window.onclick = function(event) {
        const modal = document.getElementById('update-password-modal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };

    // Função para enviar o formulário de atualização de senha
    document.getElementById('update-password-form').addEventListener('submit', function(event) {
        event.preventDefault(); // Evita o envio padrão do formulário

        const newPassword = document.getElementById('new-password').value;
        const confirmNewPassword = document.getElementById('confirm-new-password').value;

        if (newPassword !== confirmNewPassword) {
            alert('As senhas não coincidem!');
            return;
        }

        // Enviar a nova senha para o servidor
        fetch('/update-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                newPassword: newPassword
            })
        })
        .then(response => response.text())
        .then(data => {
            alert(data);
            if (data === 'Senha atualizada com sucesso!') {
                document.getElementById('update-password-modal').style.display = 'none';
            }
        })
        .catch(error => {
            console.error('Erro ao atualizar a senha:', error);
        });
    });
});

document.getElementById('register-professional').addEventListener('submit', async function(e) {
    e.preventDefault(); o

    const formData = new FormData(this); 

    // Envia os dados para o backend usando fetch
    const response = await fetch('/api/professionals/register', {
        method: 'POST',
        body: formData
    });

    const data = await response.json();
    if (data.success) {
        alert('Profissional cadastrado com sucesso!');
        carregarProfissionais(); 
    } else {
        console.error('Erro ao cadastrar profissional:', data.error);
    }
});

//DIARIO PESSOAL    

document.getElementById('diarioForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const diarioInput = document.getElementById('diario').value;

    fetch('/api/diarios', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ diario: diarioInput })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao salvar no diário');
        }
        return response.json();
    })
    .then(data => {
        carregarDiarios(); 
        closeModal('diarioModal'); 
    })
    .catch(error => console.error('Erro:', error));

    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show'); 
            modal.style.display = 'none'; 
        }
    }
});
document.addEventListener('DOMContentLoaded', carregarDiario);

function carregarDiario() {
    fetch('/api/diarios')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar entradas do diário');
            }
            return response.json();
        })
        .then(diarios => {
            mostrarDiario(diarios);
        })
        .catch(error => console.error('Erro:', error));
}

function mostrarDiario(diarios) {
    const listaDiario = document.getElementById('listaDiario');
    listaDiario.innerHTML = ''; 

    diarios.forEach(diario => {
        const diarioLi = document.createElement('li');
        diarioLi.classList.add('diario-item');
        diarioLi.innerHTML = `
            ${diario.entrada} - <span>${new Date(diario.data_entrada).toLocaleDateString()}</span>
            <button class="delete-diario" data-id="${diario.id}">✖</button>
        `;
        listaDiario.appendChild(diarioLi);
    });
}

document.getElementById('listaDiario').addEventListener('click', function(event) {
    if (event.target.classList.contains('delete-diario')) {
        const diarioId = event.target.getAttribute('data-id');

        fetch(`/api/diarios/${diarioId}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao excluir entrada do diário');
            }
            carregarDiario(); 
        })
        .catch(error => console.error('Erro:', error));
    }
});



//METAS PESSOAIS

// Adicione isso no seu arquivo JavaScript
document.getElementById('metaForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Previne o comportamento padrão do formulário

    const metaInput = document.getElementById('meta').value; // Captura o valor da meta
    const dataMeta = new Date().toISOString();

    // Enviar a meta para o servidor
    fetch('/api/metas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ meta: metaInput, data_meta: dataMeta  })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao salvar a meta');
        }
        return response.json(); // Retorna a resposta em JSON
    })
    .then(data => {
        // Aqui você pode atualizar a lista de metas ou mostrar uma mensagem de sucesso
        console.log('Meta salva:', data);
        // Adicione lógica para atualizar a interface com a nova meta
        carregarMetas();
    })
    .catch(error => {
        console.error('Erro:', error);
    });
});

// Função para buscar e exibir as metas do usuário
function carregarMetas() {
    fetch('/api/metas') // Faz a requisição para buscar as metas
        .then(response => response.json()) // Converte a resposta para JSON
        .then(metas => {
            const metasContainer = document.getElementById('listaMetas'); // Seleciona o contêiner onde as metas serão exibidas
            metasContainer.innerHTML = '';

            // Itera sobre cada meta e cria um elemento para exibir
            metas.forEach(meta => {
                const metaElement = document.createElement('div');
                metaElement.classList.add('meta-item'); // Adiciona uma classe para estilização
                metaElement.innerHTML = `
                    <h3>${meta.meta}</h3>
                    <p>Data: ${new Date(meta.data_meta).toLocaleDateString()}</p>
                    <button class="delete-btn" onclick="excluirMeta(${meta.id})" style="color: white;">X</button>
                `;
                metasContainer.appendChild(metaElement); // Adiciona a meta ao contêiner
            });
        })
        .catch(error => {
            console.error('Erro ao buscar metas:', error);
        });
}

// Função para excluir uma meta
function excluirMeta(id) {
    console.log('Tentando excluir a meta com id:', id); // Verificar se a função é chamada

    fetch(`/api/metas/${id}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (response.ok) {
            console.log('Meta excluída com sucesso!'); // Confirmar exclusão
            carregarMetas(); // Recarregar a lista de metas após exclusão
        } else {
            console.error('Erro ao excluir meta');
        }
    })
    .catch(error => {
        console.error('Erro ao excluir meta:', error);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    carregarMetas(); // Carregar as metas quando a página for carregada
});


//REGISTRO DE EMOÇOES

// Adiciona evento de submit ao formulário
document.getElementById('emocoesForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevenir o comportamento padrão de envio do formulário

    const emocao = document.getElementById('emocao').value;
    const dataEntrada = new Date().toISOString().slice(0, 10)// Pegar data e hora atuais

    // Enviar os dados para o servidor
    fetch('/api/diario', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ emocao: emocao, data_emocao: dataEntrada })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('Emoção registrada com sucesso!');
            document.getElementById('emocao').value = ''; // Limpar o textarea após salvar
            carregarEmocoes(); // Atualizar a lista de emoções
        } else {
            console.error('Erro ao registrar emoção:', data.error);
        }
    })
    .catch(error => {
        console.error('Erro ao salvar emoção:', error);
    });
});

// Função para carregar emoções do banco de dados
function carregarEmocoes() {
    fetch('/api/diario')
        .then(response => response.json())
        .then(data => {
            const listaEmocoes = document.getElementById('listaEmocoes');
            listaEmocoes.innerHTML = ''; 

            data.forEach(entrada => {
                const dataEmocao = new Date(entrada.data_emocao); 
                const dataFormatada = isNaN(dataEmocao) ? 'Data inválida' : dataEmocao.toLocaleDateString();
            
                const li = document.createElement('li');
                li.setAttribute('data-id', entrada.id); 
                li.innerHTML = `
                    ${entrada.emocao} - ${dataFormatada} 
                    <button class="btn-excluir" onclick="excluirEmocao(${entrada.id})" style="color: white;">X</button>
                `;
                listaEmocoes.appendChild(li);
            });
            
        })
        .catch(error => {
            console.error('Erro ao carregar emoções:', error);
        });
}

// Função para excluir a entrada do diário
function excluirEmocao(id) {
    fetch(`/api/diario/${id}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (response.ok) {
            // Remove o item da lista se a exclusão for bem-sucedida
            const item = document.querySelector(`li[data-id='${id}']`);
            if (item) {
                item.remove(); // Remove o item da lista
            }
            carregarEmocoes(); // Recarrega a lista após a exclusão
        } else {
            return response.json().then(err => {
                console.error('Erro ao deletar a entrada:', err);
            });
        }
    })
    .catch(error => {
        console.error('Erro ao excluir a entrada:', error);
    });
}

// Carrega as emoções ao carregar a página
document.addEventListener('DOMContentLoaded', carregarEmocoes);


