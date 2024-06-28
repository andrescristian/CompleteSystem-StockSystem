const { app, BrowserWindow, Menu, dialog, ipcMain, nativeTheme, shell } = require('electron/main')
const path = require('node:path')

// ###################################################
//importar fs para trabalhar com os arquivos de imagens
const fs = require('fs')
const { conectar, desconectar } = require('./db')
//importar o Schema (models)
const Cadastros = require(`${__dirname}/src/models/Cadastros`)
const Fornecedores = require(`${__dirname}/src/models2/Fornecedores`)
const Produto = require(`${__dirname}/src/models3/Produtos`)

let win
const createWindow = () => {
    nativeTheme.themeSource = 'dark'
    win = new BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false
        },
        icon: `${__dirname}/src/public/img/logoaaa.png`
    })
    const menuPersonalizado = Menu.buildFromTemplate(menuTemplate)
    Menu.setApplicationMenu(menuPersonalizado)
    win.loadFile(`${__dirname}/src/views/index.html`)
}

let winAbout
const aboutWindow = () => {
    winAbout = new BrowserWindow({
        width: 1090,
        height: 720,
        icon: `${__dirname}/src/public/img/logoaaa.png`,
        resizable: false,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })

    winAbout.loadFile(`${__dirname}/src/views/cadastro.html`)

}

const aboutWindow2 = () => {
    winAbout = new BrowserWindow({
        width: 1280,
        height: 720,
        icon: `${__dirname}/src/public/img/logoaaa.png`,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false
        }
    })
    const menuPersonalizado = Menu.buildFromTemplate(menuTemplate)
    Menu.setApplicationMenu(menuPersonalizado)
    winAbout.loadFile(`${__dirname}/src/views/editar.html`)
}

let winAbout3
const aboutWindow3 = () => {
    if (!winAbout3) {
        winAbout3 = new BrowserWindow({
            width: 1280,
            height: 720,
            icon: `${__dirname}/src/public/img/logoaaa.png`,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js'),
                nodeIntegration: true,
                contextIsolation: false
            }
        })
    }
    winAbout3.setMenu(null)
    winAbout3.loadFile(`${__dirname}/src/public/img/logoaaa.png`)
    winAbout3.on('closed', () => {
        winAbout3 = null
    })
}

let winFornecedores
const fornecedoresWindow = () => {
    winFornecedores = new BrowserWindow({
        width: 1090,
        height: 720,
        icon: `${__dirname}/src/public/img/logoaaa.png`,
        resizable: false,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })

    winFornecedores.loadFile(`${__dirname}/src/views/fornecedores.html`)

}

let winRenderizar
const renderizarWindow = () => {
    winRenderizar = new BrowserWindow({
        width: 1280,
        height: 720,
        icon: `${__dirname}/src/public/img/logoaaa.png`,
        resizable: false,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })
    winRenderizar.loadFile(`${__dirname}/src/views/relatorio.html`)
}

let produtos
const telaProdutos = () => {
  produtos = new BrowserWindow({
    width: 1280,
    height: 720,
    icon: `${__dirname}/src/public/img/logoaaa.png`,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    }
  })
  produtos.loadFile(`${__dirname}/src/views/produto.html`)
}

let relatorioProdutos
const relatorioProd = () => {
  relatorioProdutos = new BrowserWindow({
    width: 1280,
    height: 720,
    icon: `${__dirname}/src/public/img/logoaaa.png`,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false
    }
  })
  relatorioProdutos.loadFile(`${__dirname}/src/views/tabelaProdutos.html`)
}

app.whenReady().then(() => {
    createWindow()
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('before-quit', async () => {
    await desconectar()
})

ipcMain.on('send-message', (event, message) => {
    console.log("<<<", message)
    statusConexao()
})

const statusConexao = async () => {
    try {
        await conectar()
        win.webContents.send('db-status', "Banco de dados conectado")
    } catch (error) {
        win.webContents.send(`db-status', "Erro de conexão: ${error.message}`)
    }
}

ipcMain.on('tela-cadastro', () => {
    aboutWindow()
})

ipcMain.on('tela-relatorio', () => {
    aboutWindow2()
})

ipcMain.on('tela-fornecedor', () => {
    fornecedoresWindow()
})

ipcMain.on('relatorio-fornecedor', () => {
    renderizarWindow()
})

ipcMain.on('tela-produtos', () => {
    telaProdutos()
})

ipcMain.on('relatorio-produtos', () => {
    relatorioProd()
})

const menuTemplate = [
    {
        label: 'Arquivo',
        submenu: [
            {
                label: 'Cadastro',
                click: aboutWindow
            },            
            {
                label: 'Fornecedores',
                click: fornecedoresWindow
            },            
            {
                label: 'Produtos',
                click: telaProdutos
            },
            {
                label: 'Sair',
                accelerator: 'Alt+F4',
                click: () => app.quit()
            }
        ]
    },
    {
        label: 'Relatório',
        submenu: [
            {
                label: 'Cliente',
                click: aboutWindow2
            },
            {
                label: 'Fornecedores',
                click: renderizarWindow
            },            
            {
                label: 'Produtos',
                click: relatorioProd
            }
        ]
    },
    {
        label: 'Editar',
        submenu: [
            {
                label: 'Desfazer',
                role: 'undo'
            },
            {
                label: 'Refazer',
                role: 'redo'
            },
            {
                type: 'separator'
            },
            {
                label: 'Recortar',
                role: 'cut'
            },
            {
                label: 'Copiar',
                role: 'copy'
            },
            {
                label: 'Colar',
                role: 'paste'
            }
        ]
    },
    {
        label: 'Exibir',
        submenu: [
            {
                label: 'Recarregar',
                role: 'reload'
            },
            {
                label: 'Ferramentas do Desenvolvedor',
                role: 'toggleDevTools'
            },
            {
                type: 'separator'
            },
            {
                label: 'Aplicar Zoom',
                role: 'zoomIn'
            },
            {
                label: 'Reduzir',
                role: 'zoomOut'
            },
            {
                label: 'Restaurar o zoom padrão',
                role: 'resetZoom'
            }
        ]
    },
    {
        label: 'Ajuda',
        submenu: [
            {
                label: 'Sobre',
                click: aboutWindow3
            }
        ]
    }
]

ipcMain.on('new-task', async (event, args) => {
    if (args.nome === "") {
        dialog.showMessageBox(winAbout, {
            type: "info",
            message: 'Preencha o nome, campo obrigatorio',
            buttons: ['ok']
        })
    } else if (args.telefone === "") {
        dialog.showMessageBox(winAbout, {
            type: "info",
            message: 'Preencha o telefone, campo obrigatorio',
            buttons: ['ok']
        })

    } else {
        const novoCadastro = new Cadastros(args)
        await novoCadastro.save()
        event.reply('new-task-created', JSON.stringify(novoCadastro))
        dialog.showMessageBox(winAbout, {
            type: 'info',
            title: 'CONEST',
            message: 'Cliente cadastrado com sucesso',
            buttons: ['OK']
        })
    }

})

ipcMain.on('new-produto', async (event, args) => {
    try {
          const uploadsDir = path.join(__dirname, 'uploads')
          if (!fs.existsSync(uploadsDir)) {
              fs.mkdirSync(uploadsDir)
          }
          const fileName = `${Date.now()}_${path.basename(args.imagemProduto)}`
          console.log(fileName);
          const destination = path.join(uploadsDir, fileName)
          console.log(destination);
          fs.copyFileSync(args.imagemProduto, destination)

          const novoProduto = new Produto({
            codigo: args.codigo,
            produto: args.produto,
            empresa: args.empresa,
            estoque: args.estoque,
            valor: args.valor,
            lucro: args.lucro,
            preco: args.lucro,
            imagemProduto: destination
        })
          dialog.showMessageBox(produtos, {
              type: 'info',
              title: 'CONEST',
              message: 'Produto cadastrado com sucesso',
              buttons: ['OK']
          })
  
      if (args.produto === "") {
        dialog.showMessageBox(produtos, {
          type: "info",
          message: 'Preencha o nome do produto, campo obrigatorio',
          buttons: ['ok']
        })
      } else if (args.fornecedor === "") {
        dialog.showMessageBox(produtos, {
          type: "info",
          message: 'Preencha o telefone, campo obrigatorio',
          buttons: ['ok']
        })
    
      } else {
        const novoCadastro = new Produto(args)
        await novoCadastro.save()
        event.reply('new-produto-created', JSON.stringify(novoCadastro))
      }
    } catch (error) {
    }
  })
 
ipcMain.on('get-tasks', async (event, args) => {
    const cadastrosPendentes = await Cadastros.find()
    console.log(cadastrosPendentes)
    event.reply('pending-tasks', JSON.stringify(cadastrosPendentes))
})

ipcMain.on('get-produto', async (event, args) => {
    const cadastrosPendentes = await Produto.find()
    console.log(cadastrosPendentes)
    event.reply('pending-produto', JSON.stringify(cadastrosPendentes))
  })

ipcMain.on('delete-task', async (event, args) => {
    console.log(args)
    const { response } = await dialog.showMessageBox(win, {
        type: 'warning',
        buttons: ['Cancelar', 'Excluir'],
        title: 'Confirmação de exclusão',
        message: 'Tem certeza que deseja excluir este cliente?'
    })
    console.log(response)

    if (response === 1) {
        const cadastroExcluido = await Cadastros.findByIdAndDelete(args)
        event.reply('delete-task-success', JSON.stringify(cadastroExcluido))

    }
})

ipcMain.on('search-client', async (event, nome) => {
    console.log(nome)
    try {
        const dadosCliente = await Cadastros.find({
            nome: new RegExp(nome, 'i')   
        })
        console.log(dadosCliente)
        if (dadosCliente.length === 0) {
            dialog.showMessageBox(winAbout, {
                type: 'question',
                message: 'Cliente não cadastrado.\nDeseja cadastrar este cliente?',
                buttons: ['Sim', 'Não']
            }).then((result) => {
                if (result.response === 0) {
                    event.reply('set-name')
                } else {
                    event.reply('clear-search')
                }
            })

        } else {
            event.reply('client-data', JSON.stringify(dadosCliente))
        }
    } catch (error) {
        console.log(error)
    }
})

ipcMain.on('search-alert', (event) => {
    dialog.showMessageBox(winAbout, {
        type: 'info',
        message: 'Preencha o nome do cliente',
        buttons: ['OK']
    })
    event.reply('search-focus')
})

ipcMain.on('search-produto', async (event, codigo) => {
    console.log(codigo)
    try {
      const dadosProdutos = await Produto.find({
        codigo: new RegExp(codigo, 'i')    
      })
      console.log(dadosProdutos)
      if (dadosProdutos.length === 0) {
        dialog.showMessageBox(produtos, {
          type: 'question',
          message: 'Produto não cadastrado.\nDeseja cadastrar este Produto?',
          buttons: ['Sim', 'Não']
        }).then((result) => {

          if (result.response === 0) {
            event.reply('set-produto')
          } else {
            event.reply('clear-search')
          }
        })
  
      } else {
        event.reply('produto-data', JSON.stringify(dadosProdutos))
      }
    } catch (error) {
      console.log(error)
    }
  })

ipcMain.on('update-task', async (event, cliente) => {
    console.log(cliente)
    if (cliente.nome === "") {
        dialog.showMessageBox(winAbout, {
            type: "info",
            message: 'Preencha o nome.',
            buttons: ['OK']
        })
    } else if (cliente.fone === "") {
        dialog.showMessageBox(winAbout, {
            type: "info",
            message: 'Preencha o telefone do cliente',
            buttons: ['OK']
        })
    } else {
        const clienteEditado = await Cadastros.findByIdAndUpdate(
            cliente.id, {
            nome: cliente.nome,
            fone: cliente.fone,
            email: cliente.email,
            cpf: cliente.cpf,
            cep: cliente.cep,
            logradouro: cliente.logradouro,
            numero: cliente.numero,
            complemento: cliente.complemento,
            bairro: cliente.bairro,
            cidade: cliente.cidade,
            uf: cliente.uf

        },
            {
                new: true
            }
        )
        dialog.showMessageBox(winAbout, {
            type: 'info',
            message: "Dados do Cliente alterado com sucesso",
            buttons: ['OK']
        }).then((result) => {
            if (result.response === 0) {
                event.reply('update-success', JSON.stringify(clienteEditado))
            } else {
                event.reply('clear-search')
            }
        })
    }})

ipcMain.on('update-client', async (event, cliente) => {
    await console.log(cliente)
    const clienteEditado = await Cadastros.findByIdAndUpdate(
        cliente.id, {
        nome: cliente.nome,
        fone: cliente.fone,
        email: cliente.email,
        cpf: cliente.cpf,
        cep: cliente.cep,
        logradouro: cliente.logradouro,
        numero: cliente.numero,
        complemento: cliente.complemento,
        cidade: cliente.cidade,
        uf: cliente.uf

    },
        {
            new: true
        }
    )
    //passo 4 confimar a exclusão e enviar ao renderer um pedido para limpar os campos  e setar os botões
    dialog.showMessageBox(winAbout, {
        type: 'info',
        message: "Dados do Cliente alterado com sucesso",
        buttons: ['OK']
    }).then((result) => {
        //verificar se o botão ok foi preenchido
        if (result.response === 0) {
            event.reply('update-success', JSON.stringify(clienteEditado))
        } else {
            //limpar a caixa de busca 
            event.reply('clear-search')
        }
    })
})


//----------------------------------------------EDITAR PRODUTO-----------------------------------------

ipcMain.on('update-produto', async (event, produto) => {
    await console.log(produto) // teste de recebimento do renderer
    //passo 3: salvar as alterações no banco de dados 17/04/2024
    const produtoEditado = await Produto.findByIdAndUpdate(
        produto.id, {
        empresa: produto.empresa,
        codigo: produto.codigo,
        produto: produto.produto,
        estoque: produto.estoque,
        valor: produto.valor,
        lucro: produto.lucro,
        preco: produto.preco,
        resultado: produto.resultado
    },
        {
            new: true
        }
    )
        //Campos obrigatórios
        if (produto.produto === "") {
            dialog.showMessageBox(produtos, {
                type: "info",
                message: 'Preencha o nome da empresa',
                buttons: ['ok']
            })
        } else if (produto.empresa === "") {
            dialog.showMessageBox(produtos, {
                type: "info",
                message: 'Preencha o telefone da empresa',
                buttons: ['ok']
            })
   
        }  else if (produto.estoque === ""){
            dialog.showMessageBox(produtos, {
                type: "info",
                message: 'Preencha o CEP da empresa',
                buttons: ['ok']
            })
        }
         else {
    //passo 4 confimar a exclusão e enviar ao renderer um pedido para limpar os campos  e setar os botões
    dialog.showMessageBox(produtos, {
        type: 'info',
        message: "Dados do produto alterado com sucesso",
        buttons: ['OK']
    }).then((result) => {
        //verificar se o botão ok foi preenchido
        if (result.response === 0) {
            event.reply('udpate-produto-success')
        } else {
            //limpar a caixa de busca
            event.reply('clear-search')
        }
    })
}
})

//Excluir um cliente  - CRUD delete

ipcMain.on('excluir-client', async (event, cliente) => {
    await console.log(cliente) // teste de recebimento do renderer
    //passo 3: salvar as alterações no banco de dados 17/04/2024
    const clienteEditado = await Cadastros.findByIdAndDelete(
        cliente.id, {
        nome: cliente.nome,
        fone: cliente.fone,
        email: cliente.email,
        cpf: cliente.cpf,
        cep: cliente.cep,
        logradouro: cliente.logradouro,
        numero: cliente.numero,
        complemento: cliente.complemento,
        cidade: cliente.cidade,
        uf: cliente.uf

    },
        {
            new: true
        }
    )
    //passo 4 confimar a exclusão e enviar ao renderer um pedido para limpar os campos  e setar os botões
    dialog.showMessageBox(winAbout, {
        type: 'warning',
        buttons: ['Cancelar', 'Excluir'],
        title: 'Confirmação de exclusão',
        message: 'Tem certeza que deseja excluir este cliente?'
    }).then((result) => {
        //verificar se o botão ok foi preenchido
        if (result.response === 1) {
            event.reply('excluir-success')
            dialog.showMessageBox(winAbout, {
                type: 'info',
                title: 'CONEST',
                message: 'Cliente excluido com sucesso',
                buttons: ['OK']
                
            })
        } else {
            //limpar a caixa de busca 
            event.reply('clear-search')
            
        }
    })
})


//------------------------excluir produto----------------------------------

//Excluir um cliente  - CRUD delete

ipcMain.on('excluir-produto', async (event, produto) => {
    await console.log(produto) // teste de recebimento do renderer
    //passo 3: salvar as alterações no banco de dados 17/04/2024
    const produtoExcluido = await Produto.findByIdAndDelete(
      produto.id, {
      empresa: produto.empresa,
      codigo: produto.codigo,
      produto: produto.produto,
      estoque: produto.estoque,
      valor: produto.valor,
      lucro: produto.lucro,
      preco: produto.lucro,
      resultado: produto.resultado
  
    },
      {
        new: true
      }
    )
    //passo 4 confimar a exclusão e enviar ao renderer um pedido para limpar os campos  e setar os botões
    dialog.showMessageBox(produtos, {
      type: 'warning',
      buttons: ['Cancelar', 'Excluir'],
      title: 'Confirmação de exclusão',
      message: 'Tem certeza que deseja excluir este Produto?'
    }).then((result) => {
      //verificar se o botão ok foi preenchido
      if (result.response === 1) {
        event.reply('excluir-success-produto')
        dialog.showMessageBox(produtos, {
            type: 'info',
            title: 'CONEST',
            message: 'Produto excluido com sucesso',
            buttons: ['OK']
            
        })
      } else {
        //limpar a caixa de busca 
        event.reply('clear-search')
      }
    })
  })
  
/* Criando a parte dos Fornecedores */

ipcMain.on('new-task-fornecedores', async (event, args) => {
    console.log(args) // teste de recebimento
    // Salvar no banco de dados os dados do formulario
    // validação dos campos obrigatorios
    if (args.fornecedor === "") {
        dialog.showMessageBox(winFornecedores, {
            type: "info",
            message: 'Preencha o nome da empresa',
            buttons: ['ok']
        })
    } else if (args.telefone === "") {
        dialog.showMessageBox(winFornecedores, {
            type: "info",
            message: 'Preencha o telefone da empresa',
            buttons: ['ok']
        })

    } else {
        const novoFornecedor = new Fornecedores(args)
        await novoFornecedor.save()

        //enviar uma confirmação para o renderer(front-end) - passo 4
        //passando a nova tarefa no formato JSON (Passo extra CRUD READ)
        event.reply('new-task-created-fornecedores', JSON.stringify(novoFornecedor))
        dialog.showMessageBox(winFornecedores, {
            type: 'info',
            title: 'CONEST',
            message: 'Fornecedor cadastrado com sucesso',
            buttons: ['OK']
        })
    }

})


ipcMain.on('get-tasks-fornecedores', async (event, args) => {
    const fornecedoresPendentes = await Fornecedores.find() //.find faz a busca e como o "select no mysql"
    console.log(fornecedoresPendentes) //passo 2 fins didaticos (teste)
    //passo 3(slide) enviar ao renderer(view) as tarefas pendentes
    event.reply('pending-tasks-fornecedores', JSON.stringify(fornecedoresPendentes))//JSON.stringify converte para o JSON
})

ipcMain.on('delete-task-fornecedores', async (event, args) => {
    console.log(args) // teste de recebimentodo id (passo 2 slide)
    //exibir uma caixa de dialogo para confirma a exclusão
    const { response } = await dialog.showMessageBox(win, {
        type: 'warning',
        buttons: ['Cancelar', 'Excluir'],
        title: 'Confirmação de exclusão',
        message: 'Tem certeza que deseja excluir este fornecedor?'
    })
    console.log(response)// Apoio a Logica

    //passo 3 excluir a tarefa do banco e enviar uma resposta para o renderer
    if (response === 1) {
        const fornecedorExcluido = await Fornecedores.findByIdAndDelete(args)
        //passo 3 excluir a tarefa do banco e enviar uma resposta para o renderer atualizar a lista de tarefas pendentes
        event.reply('delete-task-success-fornecedores', JSON.stringify(fornecedorExcluido))

    }
})


ipcMain.on('search-client-fornecedores', async (event, nome) => {
    console.log(nome) //teste do passo 3
    //passo 4 - buscar o nome no banco de dados
    try {
        const dadosFornecedor = await Fornecedores.find({
            fornecedor: new RegExp(nome, 'i') //i ignore(letras maiuscula/minuscula)    
        })
        console.log(dadosFornecedor) //teste passo 4
        //validação (se não existir o cliente informar o usuario)
        if (dadosFornecedor.length === 0) {
            dialog.showMessageBox(winFornecedores, {
                type: 'question',
                message: 'Fornecedor não cadastrado.\nDeseja cadastrar este fornecedor?',
                buttons: ['Sim', 'Não']
            }).then((result) => {
                //verifica o botão pressionado (Sim = 0)
                // console.log(result)
                if (result.response === 0) {
                    //setar o nome na caixa input
                    event.reply('set-name-fornecedores')
                } else {
                    //limpar a caixa input de busca
                    event.reply('clear-search-fornecedores')
                }
            })

        } else {
            // se existir o cliente pesquisado, enviar os dados para o renderer (passo 5)
            event.reply('client-data-fornecedores', JSON.stringify(dadosFornecedor))
        }
    } catch (error) {
        console.log(error)
    }
})


ipcMain.on('search-alert-fornecedores', (event) => {
    dialog.showMessageBox(winFornecedores, {
        type: 'info',
        message: 'Preencha o nome do cliente',
        buttons: ['OK']
    })
    event.reply('search-focus-fornecedores')
})




ipcMain.on('update-client-fornecedores', async (event, cliente) => {
    await console.log(cliente) // teste de recebimento do renderer
    //passo 3: salvar as alterações no banco de dados 17/04/2024
    const fornecedorEditado = await Fornecedores.findByIdAndUpdate(
        cliente.id, {
        fornecedor: cliente.fornecedor,
        fone: cliente.fone,
        email: cliente.email,
        cnpj: cliente.cnpj,       //Trocar CPF pelo CNPJ
        cep: cliente.cep,
        logradouro: cliente.logradouro,
        numero: cliente.numero,
        complemento: cliente.complemento,       //Adicionar mais campos, inscrição estadual, site, CNPJ
        cidade: cliente.cidade,
        uf: cliente.uf,
        site: cliente.site,
        inscricao: cliente.inscricao

    },
        {
            new: true
        }
    )

    //Campos obrigatórios
    if (cliente.fornecedor === "") {
        dialog.showMessageBox(winFornecedores, {
            type: "info",
            message: 'Preencha o nome da empresa',
            buttons: ['ok']
        })
    } else if (cliente.fone === "") {
        dialog.showMessageBox(winFornecedores, {
            type: "info",
            message: 'Preencha o telefone da empresa',
            buttons: ['ok']
        })

    }  else if (cliente.cep === ""){
        dialog.showMessageBox(winFornecedores, {
            type: "info",
            message: 'Preencha o CEP da empresa',
            buttons: ['ok']
        })
    } else if (cliente.logradouro === ""){
        dialog.showMessageBox(winFornecedores, {
            type: "info",
            message: 'Preencha o logradouro da empresa',
            buttons: ['ok']
        })
    } else if (cliente.numero === ""){
        dialog.showMessageBox(winFornecedores, {
            type: "info",
            message: 'Preencha o número da empresa',
            buttons: ['ok']
        })
    } else if (cliente.complemento === ""){
        dialog.showMessageBox(winFornecedores, {
            type: "info",
            message: 'Preencha o complemento da empresa',
            buttons: ['ok']
        })
    } else if (cliente.cidade === ""){
        dialog.showMessageBox(winFornecedores, {
            type: "info",
            message: 'Preencha o nome da cidade da empresa',
            buttons: ['ok']
        })
    }
     else {
        //passo 4 confimar a exclusão e enviar ao renderer um pedido para limpar os campos  e setar os botões
    dialog.showMessageBox(winFornecedores, {
        type: 'info',
        message: "Dados do Fornecedor alterado com sucesso",
        buttons: ['OK']
    }).then((result) => {
        //verificar se o botão ok foi preenchido
        if (result.response === 0) {
            event.reply('update-success-fornecedores')
        } else {
            //limpar a caixa de busca 
            event.reply('clear-search-fornecedores')
        }
    })
    }
    
})


//excluir-client == excluir-fornecedor
ipcMain.on('excluir-fornecedor', async (event, cliente) => {
    await console.log(cliente) // teste de recebimento do renderer
    //passo 3: salvar as alterações no banco de dados 17/04/2024
    const fornecedorEditado = await Fornecedores.findByIdAndDelete(
        cliente.id, {
        fornecedor: cliente.fornecedor,
        fone: cliente.fone,
        email: cliente.email,
        cnpj: cliente.cnpj,
        cep: cliente.cep,
        logradouro: cliente.logradouro,
        numero: cliente.numero,
        complemento: cliente.complemento,
        cidade: cliente.cidade,
        uf: cliente.uf,
        site: cliente.site,
        inscricao: cliente.inscricao

    },
        {
            new: true
        }
    )
    //passo 4 confimar a exclusão e enviar ao renderer um pedido para limpar os campos  e setar os botões
    dialog.showMessageBox(winFornecedores, {
        type: 'warning',
        buttons: ['Cancelar', 'Excluir'],
        title: 'Confirmação de exclusão',
        message: 'Tem certeza que deseja excluir este fornecedor?'
    }).then((result) => {
        //verificar se o botão ok foi preenchido
        if (result.response === 1) {
            event.reply('excluir-success-fornecedores')
            dialog.showMessageBox(winFornecedores, {
                type: 'info',
                title: 'CONEST',
                message: 'Fornecedor excluido com sucesso',
                buttons: ['OK']
                
            })
        } else {
            //limpar a caixa de busca 
            event.reply('clear-search-fornecedores')
        }
    })
})


//Aula 06/05, depois do renderer.js
ipcMain.on('url-site', (event, site) =>{
    let url = site.url
    console.log(url)
    shell.openExternal(url)
})


//codigo de barras 10/05/2024
// Receber barcode //codigo de barra 10/05/2024
ipcMain.on('search-barcode', (event, barcode) => {
    console.log(barcode)
  })
  
