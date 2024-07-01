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

let  formulario, formFornecedor, formTelefone, formEmail, formCep, formLogradouro, formBairro,
formCidade, formUf, formCnpj, formNumero, formComplemento, formSite, formInscricao, lista, idCliente
formulario = document.querySelector("#formCadastros")
idCliente = document.querySelector('#idClient')
formFornecedor = document.querySelector("#formFornecedor")
formTelefone = document.querySelector("#formTelefone")
formEmail = document.querySelector("#formEmail")
formCnpj = document.querySelector("#formCnpj")
formCep = document.querySelector("#formCep")
formLogradouro = document.querySelector("#formLogradouro")
formNumero = document.querySelector("#formNumero")
formComplemento = document.querySelector("#formComplemento")
formBairro = document.querySelector("#formBairro")
formCidade = document.querySelector("#formCidade")
formUf = document.querySelector("#formUf")
formSite = document.querySelector("#formSite")
formInscricao = document.querySelector("#formInscricao")
lista = document.querySelector("#listaCadastros")
btnUpdate = document.querySelector('#btnUpdate')
btnDelete = document.querySelector('#btnDelete')

let arrayCadastros = []
let updateStatus = false
let idCadastro

formulario.addEventListener("submit", async (event) =>{
    event.preventDefault()
    const cadastros = {
        fornecedor: formFornecedor.value, 
        telefone: formTelefone.value,
        email: formEmail.value,
        cep: formCep.value,
        logradouro: formLogradouro.value,
        numero: formNumero.value,
        complemento: formComplemento.value,
        bairro: formBairro.value,
        cidade: formCidade.value,
        uf: formUf.value,
        cnpj: formCnpj.value,
        site: formSite.value,
        inscricao: formInscricao.value
    }
    
    if (updateStatus === false) {
        ipcRenderer.send('new-task-fornecedores', cadastros,)
        formulario.reset()
    } else {
        ipcRenderer.send('update-task', {...cadastros, idCadastro})
    }
    renderizarFornecedores(arrayCadastros)
})

ipcRenderer.on('new-task-created-fornecedores', (event,args) => {
    const novoCadastros = JSON.parse(args)
    arrayCadastros.push(novoCadastros)
    renderizarFornecedores(arrayCadastros)
})

function cadastro(){
    ipcRenderer.send('tela-cadastro')
}

function relatorio(){
    ipcRenderer.send('tela-relatorio')
}

ipcRenderer.send('get-tasks-fornecedores')

ipcRenderer.on('pending-tasks-fornecedores', (event, args) => {
    console.log(args)
    const cadastrosPendentes = JSON.parse(args)
    arrayCadastros = cadastrosPendentes
    console.log(arrayCadastros)
    renderizarFornecedores(arrayCadastros)
})

function excluirCadastro(id) {
    console.log(id)
    ipcRenderer.send('delete-task-fornecedores', id)
}

ipcRenderer.on('delete-task-success-fornecedores', (event, args) =>{
    console.log(args)
    const cadastroEliminado = JSON.parse(args)
    const cadastroAtualizado = arrayCadastros.filter((t)=> {
        return t._id !== cadastroEliminado._id
    })
    arrayCadastros = cadastroAtualizado
    renderizarFornecedores(arrayCadastros)
})

function renderizarFornecedores(tasks) {

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
    <td>${t.fornecedor}</td>
    <td>${t.telefone}</td>
    <td>${t.email}</td>
    <td>${t.cep}</td>
    <td>${t.logradouro}</td>
    <td>${t.numero}</td>
    <td>${t.complemento}</td>
    <td>${t.bairro}</td>
    <td>${t.cidade}</td>
    <td>${t.uf}</td>
    <td>${t.cnpj}</td>
    <td>${t.site}</td>
    <td>${t.inscricao}</td>
    </tr>
    `  
    })
}

function pesquisarCliente() {
    let nome = document.getElementById('inputSearch').value
    if (nome === '') {
           ipcRenderer.send('search-alert-fornecedores') 
    } else {
    ipcRenderer.send('search-client-fornecedores', nome)
    }
}

ipcRenderer.on('search-focus', () => {
    document.getElementById('inputSearch').focus
})

let arrayFornecedor = []

ipcRenderer.on('client-data-fornecedores', (event, dadosCliente) =>{
    console.log(dadosCliente)
    const cliente = JSON.parse(dadosCliente)
    arrayFornecedor = cliente
    console.log(arrayFornecedor)
    arrayFornecedor.forEach((c) =>{
        document.getElementById("idClient").value = c._id
        document.getElementById("formFornecedor").value = c.fornecedor
        document.getElementById("formTelefone").value = c.telefone
        document.getElementById("formEmail").value = c.email
        document.getElementById("formCnpj").value = c.cnpj
        document.getElementById("formCep").value = c.cep
        document.getElementById("formLogradouro").value = c.logradouro
        document.getElementById("formNumero").value = c.numero
        document.getElementById("formComplemento").value = c.complemento
        document.getElementById("formBairro").value = c.bairro
        document.getElementById("formCidade").value = c.cidade
        document.getElementById("formUf").value = c.uf
        document.getElementById("formSite").value = c.site
        document.getElementById("formInscricao").value = c.inscricao

        document.getElementById("inputSearch").value = ""
        document.getElementById("btnSalvar").disabled = true
        document.getElementById("btnUpdate").disabled = false
        document.getElementById("btnDelete").disabled = false
    })
})

ipcRenderer.on('set-name-fornecedores', () => {
    let setarNome = document.getElementById("inputSearch").value
    document.getElementById("formFornecedor").value = setarNome
    document.getElementById("inputSearch").value = ""
})

ipcRenderer.on('clear-search-fornecedores', () => {
    document.getElementById("inputSearch").value = ""
})

function editarCliente() {
    const cliente = {
         id: idCliente.value,
         fornecedor: formFornecedor.value,
         fone: formTelefone.value,
         email: formEmail.value,
         cnpj: formCnpj.value,
         cep: formCep.value,
         logradouro: formLogradouro.value,
         numero: formNumero.value,
         complemento: formComplemento.value,
         bairro: formBairro.value,
         cidade: formCidade.value,
         uf: formUf.value,
         site: formSite.value,
         inscricao: formInscricao.value
    }
    console.log(cliente)
    ipcRenderer.send('update-client-fornecedores', cliente)
}

ipcRenderer.on('update-success-fornecedores', () => {
    formulario.reset()
    clean()
})

function excluirCliente() {
    const cliente = {
         id: idCliente.value,
         fornecedor: formFornecedor.value,
         fone: formTelefone.value,
         email: formEmail.value,
         cnpj: formCnpj.value,
         cep: formCep.value,
         logradouro: formLogradouro.value,
         numero: formNumero.value,
         complemento: formComplemento.value,
         bairro: formBairro.value,
         cidade: formCidade.value,
         uf: formUf.value,
         site: formSite.value,
         inscricao: formInscricao.value
    }
    console.log(cliente) 
    ipcRenderer.send('excluir-fornecedor', cliente)
}

ipcRenderer.on('excluir-success-fornecedores', () => {
    formulario.reset()
    clean()
})

ipcRenderer.on('db-status', (event, status) => {
    console.log(status)
    if (status === "Banco de dados conectado") {
        document.getElementById("status").src = "../public/img/db-on.png"
    } else{
        document.getElementById("status").src = "../public/img/db-off.png"
    }
})

function acessarSite() {
    const site = {
        url: formSite.value
    }
    console.log(site)
    ipcRenderer.send('url-site', site)
}

document.getElementById("inputSearch").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
         event.preventDefault()
         pesquisarCliente()
    document.getElementById('formTelefone').focus()
    }
})
