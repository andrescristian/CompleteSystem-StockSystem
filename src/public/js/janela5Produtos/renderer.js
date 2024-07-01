const { ipcRenderer } = require('electron')
ipcRenderer.send('send-message', "Status do bando de dados:")

document.addEventListener("DOMContentLoaded", () => {
    btnUpdate.disabled = true
    btnDelete.disabled = true
})

function clean() {
    document.getElementById("btnSalvar").disabled = false
    document.getElementById("btnUpdate").disabled = true
    document.getElementById("btnDelete").disabled = true
    // ###################################################
    // setar imagem padrão ao limpar a tela
    imagemProdutoPreview.src = "../public/img/camera.png"
    document.getElementById("inputProduct").focus()
}

let formulario, formNome, formTelefone, formEmail, formCep, formLogradouro, formBairro, formCidade, formUf, formCpf, 
formNumero, formComplemento, lista, idCliente, formCnpj, formEmpresa, formInscricao, formContato, formSite,
formCodigo, formProduto, formEstoque, formValor, nomeFornecedor, codigoDeBarra, lucro, resultado, preco
formulario = document.querySelector("#formCadastros")
idCliente = document.querySelector('#idClient')
formTelefone = document.querySelector("#formTelefone")
formEmail = document.querySelector("#formEmail")
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
formEmpresa = document.querySelector('#formEmpresa')
formCnpj = document.querySelector('#formCnpj')
formInscricao = document.querySelector('#formInscricao')
formContato = document.querySelector('#formContato')
formSite = document.querySelector('#formSite')
formCodigo = document.querySelector('#formCodigo')
formProduto = document.querySelector('#formProduto')
formEstoque = document.querySelector('#formEstoque')
formValor = document.querySelector('#formValor')
nomeFornecedor = document.querySelector('#formFornecedor')
codigoDeBarra = document.getElementById("inputProduct")
lucro = document.getElementById("lucro")
resultado = document.getElementById("resultado")

// ###################################################
// obter imagem do documento html
imagemProdutoInput = document.querySelector("#imagemProduto")
//renderizar imagem
imagemProdutoPreview = document.querySelector("#imagemProdutoPreview")

let arrayProdutos = []
let arrayFornecedores = []
let arrayFornecedor = []
let updateStatus = false
let idCadastro

ipcRenderer.send('procurar-nome')

ipcRenderer.on('manda-nome', (event, args) => {
    console.log(args)
    let nomeFornecedores = JSON.parse(args)
    arrayFornecedores = nomeFornecedores
    renderizarFornecedores(arrayFornecedores)
})

formulario.addEventListener("submit", async (event) => {
    event.preventDefault()
    const cadastros = {
        empresa: nomeFornecedor.value,
        codigo: formCodigo.value,
        produto: formProduto.value,
        estoque: formEstoque.value,
        valor: formValor.value,
        lucro: lucro.value,
        resultado: resultado.value,
        // ###################################################
        // enviar o arquivo de imagem e caminho ao main
        imagemProduto: imagemProdutoInput.files[0].path
    }
    if (updateStatus === false) {
        ipcRenderer.send('new-produto', cadastros) // passo 2 do slide crud create- envio dos dados para o main 
        formulario.reset()
    } else {
        ipcRenderer.send('update-produto', { ...cadastros, idCadastro })
    }
    renderizarCadastros(arrayFornecedor)
    renderizarFornecedores(arrayFornecedor)
})

ipcRenderer.on('new-produto-created', async (event, args) => {
    console.log(args)
    const novoProduto = JSON.parse(args)
    console.log(novoProduto)
    arrayProdutos.push(novoProduto)
    renderizarCadastros(arrayFornecedor)
    renderizarFornecedores(arrayFornecedor)
})

function cadastro() {
    ipcRenderer.send('tela-cadastro')
}

function relatorio() {
    ipcRenderer.send('tela-relatorio')
}

function fornecedor() {
    ipcRenderer.send('tela-fornecedor')
}

function relatorioFornecedor() {
    ipcRenderer.send('relatorio-fornecedor')
}

function produtos() {
    ipcRenderer.send('tela-produtos')
}

function relatorioProdutos() {
    ipcRenderer.send('relatorio-produtos')
}

ipcRenderer.send('get-produto')

ipcRenderer.on('pending-produto', (event, args) => {
    console.log(args)
    const fornecedorPendentes = JSON.parse(args)
    arrayFornecedor = fornecedorPendentes
    console.log(arrayFornecedor)
    renderizarCadastros(arrayFornecedor)
})

document.getElementById("inputProduct").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault()
        pesquisarProduto()             
        codigo = codigoDeBarra.value
        document.getElementById("inputProduct").disabled = true
    }
})

function excluirCadastro(id) {
    console.log(id)
    ipcRenderer.send('delete-task', id)
}

ipcRenderer.on('delete-task-success', (event, args) => {
    console.log(args)
    const cadastroEliminado = JSON.parse(args)
    const cadastroAtualizado = arrayProdutos.filter((t) => {
        return t._id !== cadastroEliminado._id
    })
    arrayProdutos = cadastroAtualizado
    renderizarCadastros(arrayProdutos)
})

function renderizarCadastros(tasks) {
    tasks.forEach((t) => {
    lista.innerHTML += `
    <tr>    
    <td>${t.empresa}</td>
    <td>${t.codigo}</td>
    <td>${t.produto}</td>
    <td>${t.estoque}</td>
    <td>R$${t.valor}</td>    
    <td>${t.lucro}%</td>
    <td>R$${t.resultado}</td>
    <td>R$ ${t.estoque * t.valor}</td>
    </tr>
    `
    })
}

function renderizarFornecedores(fornecedores) {
    fornecedores.forEach((t) => {
        console.log(t.empresa)
        nomeFornecedor.innerHTML += `
        /<option value="${t.empresa}">${t.empresa}</option>
        `
    })
}

function pesquisarProduto() {
    let produto = document.getElementById('inputProduct').value
    if (produto === '') {
        ipcRenderer.send('search-alert')
    } else {
        ipcRenderer.send('search-produto', produto)
    }
}

ipcRenderer.on('sourch-focus', () => {
    document.getElementById('inputSearch').focus
})

let arrayProduto = []

ipcRenderer.on('produto-data', (event, dadosProdutos) => {
    console.log(dadosProdutos)
    const produto = JSON.parse(dadosProdutos)
    arrayProduto = produto
    console.log(arrayProduto)
    arrayProduto.forEach((c) => {
        document.getElementById("idProduct").value = c._id
        document.getElementById("idClient").value = c._id
        document.getElementById("formCodigo").value = c.codigo
        document.getElementById("formProduto").value = c.produto
        document.getElementById("formEstoque").value = c.estoque
        document.getElementById("formValor").value = c.valor
        document.getElementById("formFornecedor").value = c.empresa
        document.getElementById("resultado").value = c.resultado

        // renderizar imagem
        imagemProdutoPreview.src = c.imagemProduto

        document.getElementById("inputProduct").value = ""
        document.getElementById("inputProduct").disabled = false
        document.getElementById("btnSalvar").disabled = true
        document.getElementById("btnUpdate").disabled = false
        document.getElementById("btnDelete").disabled = false
    })
})

ipcRenderer.on('set-produto', () => {
    let setarProduto = document.getElementById("inputProduct").value
    document.getElementById("formProduto").value = setarProduto
    document.getElementById("inputSearch").value = ""
})

ipcRenderer.on('clear-search', () => {
    document.getElementById("inputSearch").value = ""
})


function editarProduto() {
    const produto = {
        id: idCliente.value,
        empresa: nomeFornecedor.value,
        codigo: formCodigo.value,
        produto: formProduto.value,
        estoque: formEstoque.value,
        valor: formValor.value,
        lucro: lucro.value,
        resultado: resultado.value
    }
    console.log(produto)
    ipcRenderer.send('update-produto', produto)
}

ipcRenderer.on('udpate-produto-success', () => {
    formulario.reset()
    clean()
})

function excluirProduto() {
    const produto = {
        id: idCliente.value,
        empresa: nomeFornecedor.value,
        codigo: formCodigo.value,
        produto: formProduto.value,
        estoque: formEstoque.value,
        valor: formValor.value,
        lucro: lucro.value,
        resultado: resultado.value
    }
    console.log(produto)
    ipcRenderer.send('excluir-produto', produto)
}

ipcRenderer.on('excluir-success-produto', () => {
    formulario.reset()
    clean()
})

ipcRenderer.on('db-status', (event, status) => {
    console.log(status)
    if (status === "Banco de dados conectado") {
        document.getElementById("status").src = "../public/img/DB-ON.png"
    } else {
        document.getElementById("status").src = "../public/img/DB-OFF.png"
    }
})

let url = document.getElementById("formSite").value
console.log(url)

function entrarsite() {
    let url = document.getElementById("formSite").value
    ipcRenderer.send('site-url', url)
}
