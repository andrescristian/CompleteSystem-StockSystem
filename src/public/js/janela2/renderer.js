const { ipcRenderer } = require('electron')
ipcRenderer.send('send-message', "Status do bando de dados:")

ipcRenderer.on('db-status', (event, status) => {
    console.log(status)
    if (status === "Banco de dados conectado") {
        
    } else {
        
    }
})

let  formulario, formNome, formTelefone, formEmail, formCep, formLogradouro, formBairro, formCidade, formUf, formCpf, lista
formulario = document.querySelector("#formCadastros")
formNome = document.querySelector("#formNome")
formTelefone = document.querySelector("#formTelefone")
formEmail = document.querySelector("#formEmail")
formCpf = document.querySelector("#formCpf")
formCep = document.querySelector("#formCep")
formLogradouro = document.querySelector("#formLogradouro")
formBairro = document.querySelector("#formBairro")
formCidade = document.querySelector("#formCidade")
formUf = document.querySelector("#formUf")
lista = document.querySelector("#listaCadastros")

let arrayCadastros = []
let updateStatus = false
let idCadastro

formulario.addEventListener("submit", async (event) =>{
    event.preventDefault()
    const cadastros = {
        nome: formNome.value, 
        telefone: formTelefone.value,
        email: formEmail.value,
        cpf: formCpf.value,
        cep: formCep.value,
        logradouro: formLogradouro.value,
        bairro: formBairro.value,
        cidade: formCidade.value,
        uf: formUf.value
    }
    
    if (updateStatus === false) {
        ipcRenderer.send('new-task', cadastros)
    } else {
        ipcRenderer.send('update-task', {...cadastros, idCadastro})
    }
    
    formulario.reset()
    renderizarCadastros(arrayCadastros)
})

ipcRenderer.on('new-task-created', (event,args) => {
    const novoCadastros = JSON.parse(args)
    arrayCadastros.push(novoCadastros)
    renderizarCadastros(arrayCadastros)
})

ipcRenderer.send('get-tasks')
ipcRenderer.on('pending-tasks', (event, args) => {
    console.log(args)
    const cadastrosPendentes = JSON.parse(args)
    arrayCadastros = cadastrosPendentes
    console.log(arrayCadastros)
    renderizarCadastros(arrayCadastros)
})

function editarCadastro(id) {
    console.log(id)
    updateStatus = true
    idCadastro = id
    const cadastroEditado = arrayCadastros.find(arrayCadastros => arrayCadastros._id === id)
    formNome.value = cadastroEditado.nome
    formTelefone.value = cadastroEditado.telefone
    formEmail.value = cadastroEditado.email
    formCpf.value = cadastroEditado.cpf
    formCep.value = cadastroEditado.cep
    formLogradouro.value = cadastroEditado.logradouro
    formBairro.value = cadastroEditado.bairro
    formCidade.value = cadastroEditado.cidade
    formUf.value = cadastroEditado.uf
}

ipcRenderer.on('update-task-success', (event, args) =>{
    console.log(args)
    const cadastroEditado= JSON.parse(args)
    arraycadastroEditado = arrayCadastros.map(t => {
        if(t._id === cadastroEditado._id) {
            t.nome = cadastroEditado.nome
            t.telefone = cadastroEditado.telefone
            t.email = cadastroEditado.email
            t.cpf = cadastroEditado.cpf
            t.cep = cadastroEditado.cep
            t.logradouro = cadastroEditado.logradouro
            t.bairro = cadastroEditado.bairro
            t.cidade = cadastroEditado.cidade
            t.uf = cadastroEditado.uf
        }
        return t
    })
    renderizarCadastros(arraycadastroEditado)
    updateStatus = false
})

function excluirCadastro(id){
    console.log(id)
    ipcRenderer.send('delete-task', id)
}

ipcRenderer.on('delete-task-success', (event, args) =>{
    console.log(args)
    const cadastroEliminado = JSON.parse(args)
    const cadastroAtualizado = arrayCadastros.filter((t)=> {
        return t._id !== cadastroEliminado._id
    })
    arrayCadastros = cadastroAtualizado
    renderizarCadastros(arrayCadastros)
})

function renderizarCadastros(tasks) {
    tasks.sort((a,b) => {
        const nomeA = a.nome.toLowerCase();
        const nomeB = b.nome.toLowerCase();
        if (nomeA < nomeB) return -1;
        if (nomeA > nomeB) return 1;
        return 0;
    });
    
    lista.innerHTML=""
    tasks.forEach((t) => {
    lista.innerHTML += `
    <tr>    
    <td>${t.nome}</td>
    <td>${t.telefone}</td>
    <td>${t.email}</td>
    <td>${t.cpf}</td>
    <td>${t.cep}</td>
    <td>${t.logradouro}</td>
    <td>${t.numero}</td>
    <td>${t.complemento}</td>
    <td>${t.bairro}</td>
    <td>${t.cidade}</td>
    <td>${t.uf}</td>
    </tr>
    `
    })
}
