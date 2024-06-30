const { ipcRenderer } = require('electron')
ipcRenderer.send('send-message', "Status do bando de dados:")

document.addEventListener("DOMContentLoaded", ()=>{
    btnUpdate.disabled = true
    btnDelete.disabled = true
})

function clean() {
    document.getElementById("btnSalvar").disabled = false
    document.getElementById("btnUpdate").disabled = true
    document.getElementById("btnDelete").disabled = true
    document.getElementById("inputSearch").focus()
}

let formulario, formNome, formTelefone, formEmail, formCep, formLogradouro, formBairro,
formCidade, formUf, formCpf, formNumero, formComplemento,  lista, idCliente
formulario = document.querySelector("#formCadastros")
idCliente = document.querySelector('#idClient')
formNome = document.querySelector("#formNome")
formTelefone = document.querySelector("#formTelefone")
formEmail = document.querySelector("#formEmail")
formCpf = document.querySelector("#formCpf")
formCep = document.querySelector("#formCep")
formLogradouro = document.querySelector("#formLogradouro")
formNumero = document.querySelector("#formNumero")
formComplemento = document.querySelector("#formComplemento")
formBairro = document.querySelector("#formBairro")
formCidade = document.querySelector("#formCidade")
formUf = document.querySelector("#formUf")
lista = document.querySelector("#listaCadastros")
btnUpdate = document.querySelector('#btnUpdate')
btnDelete = document.querySelector('#btnDelete')

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
        numero: formNumero.value,
        complemento: formComplemento.value,
        bairro: formBairro.value,
        cidade: formCidade.value,
        uf: formUf.value
    }
    if (updateStatus === false) {
        ipcRenderer.send('new-task', cadastros,)
        formulario.reset()
    }else {
        ipcRenderer.send('update-task', {...cadastros, idCadastro})
    }
    renderizarCadastros(arrayCadastros)
})

ipcRenderer.on('new-task-created', (event,args) =>{
    const novoCadastros = JSON.parse(args)
    arrayCadastros.push(novoCadastros)
    renderizarCadastros(arrayCadastros)
    
})

function cadastro(){
    ipcRenderer.send('tela-cadastro')
}

function relatorio(){
    ipcRenderer.send('tela-relatorio')
}

function fornecedor(){
    ipcRenderer.send('tela-fornecedor')
}

function relatorioFornecedor(){
    ipcRenderer.send('relatorio-fornecedor')
}

function produtos(){
    ipcRenderer.send('tela-produtos')
}
function relatorioProdutos(){
    ipcRenderer.send('relatorio-produtos')
}

ipcRenderer.send('get-tasks')

ipcRenderer.on('pending-tasks', (event, args) => {
    console.log(args)
    const cadastrosPendentes = JSON.parse(args)
    arrayCadastros = cadastrosPendentes
    console.log(arrayCadastros)
    renderizarCadastros(arrayCadastros)
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

function pesquisarCliente(){
       let nome = document.getElementById('inputSearch').value
       if (nome === '') {
           ipcRenderer.send('search-alert') 
       } else {
       ipcRenderer.send('search-client', nome)
       }
}

ipcRenderer.on('search-focus', () =>{
    document.getElementById('inputSearch').focus
})

let arrayCliente = []

ipcRenderer.on('client-data', (event, dadosCliente) =>{
    console.log(dadosCliente)
    const cliente = JSON.parse(dadosCliente)
    arrayCliente = cliente
    console.log(arrayCliente)
    arrayCliente.forEach((c) =>{
        document.getElementById("idClient").value = c._id
        document.getElementById("formNome").value = c.nome
        document.getElementById("formTelefone").value = c.telefone
        document.getElementById("formEmail").value = c.email
        document.getElementById("formCpf").value = c.cpf
        document.getElementById("formCep").value = c.cep
        document.getElementById("formLogradouro").value = c.logradouro
        document.getElementById("formNumero").value = c.numero
        document.getElementById("formComplemento").value = c.complemento
        document.getElementById("formBairro").value = c.bairro
        document.getElementById("formCidade").value = c.cidade
        document.getElementById("formUf").value = c.uf

        document.getElementById("inputSearch").value = ""
        document.getElementById("btnSalvar").disabled = true
        document.getElementById("btnUpdate").disabled = false
        document.getElementById("btnDelete").disabled = false
    })
})

ipcRenderer.on('set-name', () => {
    let setarNome = document.getElementById("inputSearch").value
    document.getElementById("formNome").value = setarNome
    document.getElementById("inputSearch").value = ""
})

ipcRenderer.on('clear-search', () => {
    document.getElementById("inputSearch").value = ""
})

function editarCliente() {
    const cliente = {
         id: idCliente.value,
         nome: formNome.value,
         fone: formTelefone.value,
         email: formEmail.value,
         cpf: formCpf.value,
         cep: formCep.value,
         logradouro: formLogradouro.value,
         numero: formNumero.value,
         complemento: formComplemento.value,
         bairro: formBairro.value,
         cidade: formCidade.value,
         uf: formUf.value
    }
    console.log(cliente) 
    ipcRenderer.send('update-task', cliente)
}

ipcRenderer.on('update-success', () => {
    formulario.reset()
    clean()
})

function excluirCliente() {
    const cliente = {
         id: idCliente.value,
         nome: formNome.value,
         fone: formTelefone.value,
         email: formEmail.value,
         cpf: formCpf.value,
         cep: formCep.value,
         logradouro: formLogradouro.value,
         numero: formNumero.value,
         complemento: formComplemento.value,
         bairro: formBairro.value,
         cidade: formCidade.value,
         uf: formUf.value
    }
    console.log(cliente)
    ipcRenderer.send('excluir-client', cliente)
}

ipcRenderer.on('excluir-success', () =>{
    formulario.reset()
    clean()
})

ipcRenderer.on('update-success', () => {
    formulario.reset(),
        clean()
})

ipcRenderer.on('db-status', (event, status) => {
    console.log(status)
    if(status === "Banco de dados conectado") {
        document.getElementById("status").src = "../public/img/db-on.png"
    }else{
        document.getElementById("status").src = "../public/img/db-off.png"
    }
})

document.getElementById("inputSearch").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
         event.preventDefault()
         pesquisarCliente()
    document.getElementById('formTelefone').focus()
    }
})
