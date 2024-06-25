const {ipcRenderer} = require('electron')

ipcRenderer.send('send-message', "Status do bando de dados:")


//Modificando propriedades dos elementos HTML ao iniciar o documento 
document.addEventListener("DOMContentLoaded", ()=>{
    btnUpdate.disabled = true //desativar botão
    btnDelete.disabled = true //desativar botão
})

// Botão clean (Limpar campos e setar os botões)
function clean() {
    document.getElementById("btnSalvar").disabled = false
    document.getElementById("btnUpdate").disabled = true
    document.getElementById("btnDelete").disabled = true
    document.getElementById("inputSearch").focus()
}




//CRUD CREATE - Inserir dados na tabela
//Passo 1 - (Receber os dados do form)

let  formulario, formNome, formTelefone, formEmail, formCep, formLogradouro, formBairro, formCidade, formUf, formCpf, formNumero, formComplemento,  lista, idCliente
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


// //Recebimento dos dados do formulario ao precionar o botão salvar - passo 1 do slide
formulario.addEventListener("submit", async (event) =>{
    event.preventDefault()//Ignorar o comportamento padrão (reiniciar o documento após envio dos dados do formulario)
    //console.log("Recebendo")
    //console.log(formNome.value, formTelefone.value, formEmail.value)
    //passo 1 do slide - envio do dados para o main 
    //criar uma estrutura de dados usando objeto para enviar ao main (argumentos)
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
        ipcRenderer.send('new-task', cadastros,) // passo 2 do slide crud create- envio dos dados para o main 
        formulario.reset()
    }else {
        ipcRenderer.send('update-task', {...cadastros, idCadastro})
    }

    
    
    renderizarCadastros(arrayCadastros)

})


//confirmar cadastro da tarefas no  banco  de dados
ipcRenderer.on('new-task-created', (event,args) =>{
    //CRUD READ - Passo extra:atualizar a lista automaticamente quando uma nova tarefa for adicionada ao banco 
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



//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//Copia do de cima 

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//CRUD READ - Buscar os dados do banco
//Enviar para o main o pedido para buscar as tarefas pendentes no banco de dados (passo 1 slide)
ipcRenderer.send('get-tasks')
//Passo 3 (slide) receber as 
ipcRenderer.on('pending-tasks', (event, args) => {
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
    const cadastrosPendentes = JSON.parse(args)
    //Atribuir ao vetor
    arrayCadastros = cadastrosPendentes
    console.log(arrayCadastros) //fins didaticos - exibir a estrutura de dados
    //Executar a função renderizarTarefas() passando com parâmetro o array
    renderizarCadastros(arrayCadastros)
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
    function excluirCadastro(id){
        console.log(id)//passo 1.3 crud delete
        //passo 2 - confirma a exclusão(main) -> enviar este ao main junto com o id da tarefa a ser excluida
    ipcRenderer.send('delete-task', id)
    }

    

//passo 4 crud delete - receber a confirmação de exclusão e 
ipcRenderer.on('delete-task-success', (event, args) =>{
    console.log(args)
    //atualizar a lista de tarefas pendentes usando um filtro no array para remover a tarefa excluida
    const cadastroEliminado = JSON.parse(args)
    const cadastroAtualizado = arrayCadastros.filter((t)=> {
        return t._id !== cadastroEliminado._id
    })
    arrayCadastros = cadastroAtualizado
    renderizarCadastros(arrayCadastros)
})

//passo 1.1 criar o botão crud Delete
//Passo 4 - Função usada para renderizar(exibir) os dados em uma lista ou tabela usando a linguagem html 
function renderizarCadastros(tasks) {

        tasks.sort((a,b) => {
            const nomeA = a.nome.toLowerCase();
            const nomeB = b.nome.toLowerCase();
    
        if (nomeA < nomeB) return -1;
        if (nomeA > nomeB) return 1;
        return 0;
        });
    //percorrer o array
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

//----------------------------------pesquisar cliente pelo nome CRUD READ-------------------------------------------
function pesquisarCliente(){
       //PASSO 1 - RECEBER O NOME DO CLIENTE PARA BUSCA NO BANCO
       let nome = document.getElementById('inputSearch').value
       //VALIDAÇAO DO CAMPO DE BUSCA (PREENCHIMENTO OBRIGATÓRIO)
       if (nome === '') {
           ipcRenderer.send('search-alert') 
       } else {
           //PASSO 2 - ENVIAR PARA O MAIN O NOME DO CLIENTE
       ipcRenderer.send('search-client', nome)
       }
}

ipcRenderer.on('search-focus', () =>{
    document.getElementById('inputSearch').focus
})

//criar um array(vetor) para manipular os dados e renderizar 
let arrayCliente = []

//receber os dados do cliente (se existir o cadastro) - passo 6
ipcRenderer.on('client-data', (event, dadosCliente) =>{
    console.log(dadosCliente) // teste do passo 6

    //passo 7 manipular a estrutura de dados e renderizar o documento html preenchendo as caixas de texto(input) com os dados extraidos do array
    const cliente = JSON.parse(dadosCliente)
    arrayCliente = cliente
    console.log(arrayCliente)//apoio a logica (extração dos dados  do array )
    //percorrer o array e setar as caixas input (caixas de texto)
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

        //limpar a caixa de texto de pesquisa
        document.getElementById("inputSearch").value = ""
        //desativar o botão Adicionar
        document.getElementById("btnSalvar").disabled = true
        //ativar os botões editar e excluir
        document.getElementById("btnUpdate").disabled = false
        document.getElementById("btnDelete").disabled = false
    })
})


ipcRenderer.on('set-name', () => {
    let setarNome = document.getElementById("inputSearch").value
    document.getElementById("formNome").value = setarNome
    document.getElementById("inputSearch").value = ""
})

//limpar a caixa de busca caso o usuário não queira cadastrar um novo cliente
ipcRenderer.on('clear-search', () => {
    document.getElementById("inputSearch").value = ""
})


function editarCliente(){
    //passo 1 - capturar os dados das caixas de texto 17/04/2024
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
    console.log(cliente) // teste da captura dos dados
    //passo 2 - enviar a estrutura de dados para o main 
    ipcRenderer.send('update-task', cliente)
}

//passo 5 : limpar os campos e setar os botões
ipcRenderer.on('update-success', () =>{
    formulario.reset()
    clean()
})

//delete cadsatro


function excluirCliente(){
    //passo 1 - capturar os dados das caixas de texto 17/04/2024
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
    console.log(cliente) // teste da captura dos dados
    //passo 2 - enviar a estrutura de dados para o main 
    ipcRenderer.send('excluir-client', cliente)
}

//passo 5 : limpar os campos e setar os botões
ipcRenderer.on('excluir-success', () =>{
    formulario.reset()
    clean()
})


//passo 5 : limpar os campos e setar os botões
ipcRenderer.on('update-success', () => {
    formulario.reset(),
        clean()
})

//receber mensagens do processo principal sobre o status da conexão
ipcRenderer.on('db-status', (event, status) => {
    console.log(status)
    if(status === "Banco de dados conectado") {
        document.getElementById("status").src = "../public/img/db-on.png"
    }else{
        document.getElementById("status").src = "../public/img/db-off.png"
    }
})


// Alterar comportamento do Enter ao enviar os dados do formulário
document.getElementById("inputSearch").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
         event.preventDefault() // desativar o comportamento padrão
         pesquisarCliente() //usar o Enter para executar uma função
    
    document.getElementById('formTelefone').focus()
    }
})