const { ipcRenderer } = require('electron')

ipcRenderer.send('send-message', "Status do bando de dados:")


//Modificando propriedades dos elementos HTML ao iniciar o documento 
document.addEventListener("DOMContentLoaded", () => {
    btnUpdate.disabled = true //desativar botão
    btnDelete.disabled = true //desativar botão
})

// Botão clean (Limpar campos e setar os botões)
function clean() {
    document.getElementById("btnSalvar").disabled = false
    document.getElementById("btnUpdate").disabled = true
    document.getElementById("btnDelete").disabled = true
    // ###################################################
    // setar imagem padrão ao limpar a tela
    imagemProdutoPreview.src = "../public/img/camera.png"
    document.getElementById("inputProduct").focus()
}



//CRUD CREATE - Inserir dados na tabela
//Passo 1 - (Receber os dados do form)

let formulario, formNome, formTelefone, formEmail, formCep, formLogradouro, formBairro, formCidade, formUf, formCpf, formNumero, formComplemento, lista, idCliente, formCnpj, formEmpresa, formInscricao, formContato, formSite, formCodigo, formProduto, formEstoque, formValor, nomeFornecedor, codigoDeBarra, lucro, resultado, preco
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

// //Recebimento dos dados do formulario ao precionar o botão salvar - passo 1 do slide
formulario.addEventListener("submit", async (event) => {
    event.preventDefault()//Ignorar o comportamento padrão (reiniciar o documento após envio dos dados do formulario)
    //console.log("Recebendo")
    //console.log(formNome.value, formTelefone.value, formEmail.value)
    //passo 1 do slide - envio do dados para o main 
    //criar uma estrutura de dados usando objeto para enviar ao main (argumentos)
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



//confirmar cadastro da tarefas no  banco  de dados
ipcRenderer.on('new-produto-created', async (event, args) => {
    //CRUD READ - Passo extra:atualizar a lista automaticamente quando uma nova tarefa for adicionada ao banco 
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


//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//Copia do de cima 

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//CRUD READ - Buscar os dados do banco
//Enviar para o main o pedido para buscar as tarefas pendentes no banco de dados (passo 1 slide)
ipcRenderer.send('get-produto')
//Passo 3 (slide) receber as 
ipcRenderer.on('pending-produto', (event, args) => {
    console.log(args)//passo 3 - fins didaticos teste de recebimento das tarefas pendentes
    //Passo 4 -  Renderizar as tarefas pendentes no documento index html
    /**
     *  4.1 criar uma lista ou tabela no html 
     *  4.2 Capturar o id a lista ou tabela
     *  4.3 criar um vetor para estruturar os dados
     *  4.4 Criar uma função para renderizar a lista ou tabela
    */

    //Criar uma constante para receber as tarefas pendentes
    //JSON.parse (Garantir o formato JSON)
    const fornecedorPendentes = JSON.parse(args)
    //Atribuir ao vetor
    arrayFornecedor = fornecedorPendentes
    console.log(arrayFornecedor) //fins didaticos - exibir a estrutura de dados
    //Executar a função renderizarTarefas() passando com parâmetro o array
    renderizarCadastros(arrayFornecedor)


})

document.getElementById("inputProduct").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault() // Evita o envio do formulário padrão 
        pesquisarProduto()             
        codigo = codigoDeBarra.value
        document.getElementById("inputProduct").disabled = true
    }

})

// function editarCadastro(id){
//     console.log(id)
//     updateStatus = true
//     idCadastro = id
//     const cadastroEditado = arrayCadastros.find(arrayCadastros => arrayCadastros._id === id)
//     formNome.value = cadastroEditado.nome
//     formTelefone.value = cadastroEditado.telefone
//     formEmail.value = cadastroEditado.email
//     formCpf.value = cadastroEditado.cpf
//     formCep.value = cadastroEditado.cep
//     formLogradouro.value = cadastroEditado.logradouro
//     formNumero.value = cadastroEditado.numero
//     formComplemento.value = cadastroEditado.complemento
//     formBairro.value = cadastroEditado.bairro
//     formCidade.value = cadastroEditado.cidade
//     formUf.value = cadastroEditado.uf

// }

//passo 5 e 6 crud update - receber a confirmação do update e renderizar novamente
// ipcRenderer.on('update-task-success', (event, args) =>{
//     console.log(args) // teste do passo 5 (recebimento do main )
//     //renderizar a tarefa - passo 6 (mapeamento do array)
//     const cadastroEditado= JSON.parse(args)
//     arraycadastroEditado = arrayCadastros.map(t => {
//         //se o id  for igual a cadastros editada
//         if(t._id === cadastroEditado._id) {
//             t.nome = cadastroEditado.nome
//             t.telefone = cadastroEditado.telefone
//             t.email = cadastroEditado.email
//             t.cpf = cadastroEditado.cpf
//             t.cep = cadastroEditado.cep
//             t.logradouro = cadastroEditado.logradouro
//             t.numero = cadastroEditado.numero
//             t.complemento = cadastroEditado.complemento
//             t.bairro = cadastroEditado.bairro
//             t.cidade = cadastroEditado.cidade
//             t.uf = cadastroEditado.uf

//         }
//         return t
//     })
//     renderizarCadastros(arraycadastroEditado)
//     updateStatus = false // sinaliza o fim do update 
// })

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//CRUD Delete - excluir os dados do banco
/**
  passo 1
  1.1 - Criar o botão excluir na lista de tarefas
  1.2 - criar a função excluirTarefa e testar no console
  1.3 - testar a passagem do id como parâmetro 
  passo 2 - confirma a exclusão
  passo 3 excluir a tarefa do banco e enviar uma resposta para o renderer
  passo 3 excluir a tarefa do banco e enviar uma resposta para o renderer atualizar a lista de tarefas pendentes
 */

//passo 1.2 Crud delete
function excluirCadastro(id) {
    console.log(id)//passo 1.3 crud delete
    //passo 2 - confirma a exclusão(main) -> enviar este ao main junto com o id da tarefa a ser excluida
    ipcRenderer.send('delete-task', id)
}



//passo 4 crud delete - receber a confirmação de exclusão e 
ipcRenderer.on('delete-task-success', (event, args) => {
    console.log(args)
    //atualizar a lista de tarefas pendentes usando um filtro no array para remover a tarefa excluida
    const cadastroEliminado = JSON.parse(args)
    const cadastroAtualizado = arrayProdutos.filter((t) => {
        return t._id !== cadastroEliminado._id
    })
    arrayProdutos = cadastroAtualizado
    renderizarCadastros(arrayProdutos)
})

//passo 1.1 criar o botão crud Delete
//Passo 4 - Função usada para renderizar(exibir) os dados em uma lista ou tabela usando a linguagem html 
function renderizarCadastros(tasks) {

    // tasks.sort((a,b) => {
    //     const nomeA = a.empresa.toLowerCase();
    //     const nomeB = b.empresa.toLowerCase();
    
    // if (nomeA < nomeB) return -1;
    // if (nomeA > nomeB) return 1;
    // return 0;
    // });
    //percorrer o array
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

//----------------------------------pesquisar cliente pelo nome CRUD READ-------------------------------------------
function pesquisarProduto() {
    //PASSO 1 - RECEBER O NOME DO CLIENTE PARA BUSCA NO BANCO
    let produto = document.getElementById('inputProduct').value
    //VALIDAÇAO DO CAMPO DE BUSCA (PREENCHIMENTO OBRIGATÓRIO)
    if (produto === '') {
        ipcRenderer.send('search-alert')
    } else {
        //PASSO 2 - ENVIAR PARA O MAIN O NOME DO CLIENTE
        ipcRenderer.send('search-produto', produto)
    }
}

ipcRenderer.on('sourch-focus', () => {
    document.getElementById('inputSearch').focus
})


let arrayProduto = []

//receber os dados do cliente (se existir o cadastro) - passo 6
ipcRenderer.on('produto-data', (event, dadosProdutos) => {
    console.log(dadosProdutos) // teste do passo 6

    //passo 7 manipular a estrutura de dados e renderizar o documento html preenchendo as caixas de texto(input) com os dados extraidos do array
    const produto = JSON.parse(dadosProdutos)
    arrayProduto = produto
    console.log(arrayProduto)//apoio a logica (extração dos dados  do array )
    //percorrer o array e setar as caixas input (caixas de texto)
    arrayProduto.forEach((c) => {
        document.getElementById("idProduct").value = c._id
        document.getElementById("idClient").value = c._id
        document.getElementById("formCodigo").value = c.codigo
        document.getElementById("formProduto").value = c.produto
        document.getElementById("formEstoque").value = c.estoque
        document.getElementById("formValor").value = c.valor
        document.getElementById("formFornecedor").value = c.empresa
        document.getElementById("resultado").value = c.resultado
        // ###################################################
        // renderizar imagem
        imagemProdutoPreview.src = c.imagemProduto

        //limpar a caixa de texto de pesquisa
        document.getElementById("inputProduct").value = ""
        document.getElementById("inputProduct").disabled = false
        //desativar o botão Adicionar
        document.getElementById("btnSalvar").disabled = true
        //ativar os botões editar e excluir
        document.getElementById("btnUpdate").disabled = false
        document.getElementById("btnDelete").disabled = false
    })
})


ipcRenderer.on('set-produto', () => {
    let setarProduto = document.getElementById("inputProduct").value
    document.getElementById("formProduto").value = setarProduto
    document.getElementById("inputSearch").value = ""
})

//limpar a caixa de busca caso o usuário não queira cadastrar um novo cliente
ipcRenderer.on('clear-search', () => {
    document.getElementById("inputSearch").value = ""
})


function editarProduto() {
    //passo 1 - capturar os dados das caixas de texto 17/04/2024
    const produto = {
        id: idCliente.value,
        empresa: nomeFornecedor.value,
        codigo: formCodigo.value,
        produto: formProduto.value,
        estoque: formEstoque.value,
        valor: formValor.value,
        lucro: lucro.value,
        resultado: resultado.value
    
        // formCodigo, formProduto, formEstoque, formValor
    }
    console.log(produto) // teste da captura dos dados
    //passo 2 - enviar a estrutura de dados para o main 
    ipcRenderer.send('update-produto', produto)
    
    
}

//passo 5 : limpar os campos e setar os botões
ipcRenderer.on('udpate-produto-success', () => {
    formulario.reset()
    clean()
})




function excluirProduto() {
    //passo 1 - capturar os dados das caixas de texto 17/04/2024
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
    console.log(produto) // teste da captura dos dados
    //passo 2 - enviar a estrutura de dados para o main 
    ipcRenderer.send('excluir-produto', produto)
}

//passo 5 : limpar os campos e setar os botões
ipcRenderer.on('excluir-success-produto', () => {
    formulario.reset()
    clean()
})


//receber mensagens do processo principal sobre o status da conexão
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



//botão visitar site 
//document.getElementById('myButton').addEventListener('click', () => {
//shell.openExternal(url)
//})

function entrarsite() {
    let url = document.getElementById("formSite").value


    ipcRenderer.send('site-url', url)
}

//codigo de barra

// CRUD Read >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// BarCode //codigo de barra 10/05/2024
// const inputField = document.getElementById("inputProduct");
// let inputValue = ""

// document.getElementById("inputProduct").addEventListener("keydown", function (event) {
//     if (event.key === "Enter") {
//         event.preventDefault() // Evita o envio do formulário padrão              
//         barcode = inputField.value
//         console.log(barcode)
//         document.getElementById("inputProduct").disabled = true
//         ipcRenderer.send('search-barcode', barcode)
//     }
// })
