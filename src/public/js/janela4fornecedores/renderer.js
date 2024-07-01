const { ipcRenderer } = require('electron')
ipcRenderer.send('send-message', "Status do bando de dados:")

ipcRenderer.on('db-status', (event, status) => {
    console.log(status)
    if (status === "Banco de dados conectado") {
        
    } else {
        
    }
})

let  formulario, formFornecedor, formTelefone, formEmail, formCep, formLogradouro, formBairro, formCidade, formUf, formCnpj, formSite, formInscricao, lista
formulario = document.querySelector("#formCadastros")
formFornecedor = document.querySelector("#formFornecedor")
formTelefone = document.querySelector("#formTelefone")
formEmail = document.querySelector("#formEmail")
formCnpj = document.querySelector("#formCnpj")
formCep = document.querySelector("#formCep")
formLogradouro = document.querySelector("#formLogradouro")
formBairro = document.querySelector("#formBairro")
formCidade = document.querySelector("#formCidade")
formUf = document.querySelector("#formUf")
formSite = document.querySelector("#formSite")
formInscricao = document.querySelector("#formInscricao")
lista = document.querySelector("#listaCadastros")

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
        bairro: formBairro.value,
        cidade: formCidade.value,
        uf: formUf.value,
        cnpj: formCnpj.value,
        site: formSite.value,
        inscricao: formInscricao.value
    }
    if (updateStatus === false) {
        ipcRenderer.send('new-task-fornecedores', cadastros,) 
    } else {
        ipcRenderer.send('update-task', {...cadastros, idCadastro})
    }

    formulario.reset()
    renderizarFornecedores(arrayCadastros)
})

ipcRenderer.on('new-task-created-fornecedores', (event,args) => {
    const novoCadastros = JSON.parse(args)
    arrayCadastros.push(novoCadastros)
    renderizarFornecedores(arrayCadastros)
})

ipcRenderer.send('get-tasks-fornecedores')

ipcRenderer.on('pending-tasks-fornecedores', (event, args) => {
    console.log(args)
    const cadastrosPendentes = JSON.parse(args)
    arrayCadastros = cadastrosPendentes
    console.log(arrayCadastros)
    renderizarFornecedores(arrayCadastros)
})

function editarCadastro(id) {
    console.log(id)
    updateStatus = true
    idCadastro = id
    const cadastroEditado = arrayCadastros.find(arrayCadastros => arrayCadastros._id === id)
    formFornecedor.value = cadastroEditado.fornecedor
    formTelefone.value = cadastroEditado.telefone
    formEmail.value = cadastroEditado.email
    formCnpj.value = cadastroEditado.cnpj
    formCep.value = cadastroEditado.cep
    formLogradouro.value = cadastroEditado.logradouro
    formBairro.value = cadastroEditado.bairro
    formCidade.value = cadastroEditado.cidade
    formUf.value = cadastroEditado.uf
    formSite.value = cadastroEditado.site
    formInscricao.value = cadastroEditado.inscricao
}

ipcRenderer.on('update-task-success', (event, args) => {
    console.log(args)
    const cadastroEditado= JSON.parse(args)
    arraycadastroEditado = arrayCadastros.map(t => {
        if (t._id === cadastroEditado._id) {
            t.fornecedor = cadastroEditado.fornecedor
            t.telefone = cadastroEditado.telefone
            t.email = cadastroEditado.email
            t.cep = cadastroEditado.cep
            t.logradouro = cadastroEditado.logradouro
            t.bairro = cadastroEditado.bairro
            t.cidade = cadastroEditado.cidade
            t.uf = cadastroEditado.uf
            t.cnpj = cadastroEditado.cnpj
            t.site =  cadastroEditado.site
            t.inscricao = cadastroEditado.inscricao
        }
        return t
    })
    renderizarFornecedores(arraycadastroEditado)
    updateStatus = false
})

function excluirCadastro(id){
    console.log(id)
    ipcRenderer.send('delete-task-fornecedores', id)
}

ipcRenderer.on('delete-task-success-fornecedores', (event, args) => {
    console.log(args)
    const cadastroEliminado = JSON.parse(args)
    const cadastroAtualizado = arrayCadastros.filter((t)=> {
        return t._id !== cadastroEliminado._id
    })
    arrayCadastros = cadastroAtualizado
    renderizarFornecedores(arrayCadastros)
})

function renderizarFornecedores(tasks) {
    lista.innerHTML=""
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
