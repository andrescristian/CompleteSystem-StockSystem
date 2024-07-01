function buscarEndereco() {
    let cep = document.getElementById('formCep').value
    let urlAPI = 'https://viacep.com.br/ws/' + cep + '/json/'

    fetch(urlAPI)
        .then(response => response.json())
        .then(dados => {
            document.getElementById('formLogradouro').value = dados.logradouro
            document.getElementById('formBairro').value = dados.bairro
            document.getElementById('formCidade').value = dados.localidade
            document.getElementById('formUf').value = dados.uf;
        })
        .catch(error => console.error('Erro ao buscar o endereço:', error));
}
document.getElementById('formCep').addEventListener('blur', buscarEndereco);

function validaCNPJ(cnpj) {
    var b = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    var c = String(cnpj).replace(/[^\d]/g, '')

    if (c.length !== 14)
        return document.getElementById("validation").src = "../public/img/errado.png"

    if (/0{14}/.test(c))
        return document.getElementById("validation").src = "../public/img/errado.png"

    for (var i = 0, n = 0; i < 12; n += c[i] * b[++i]);
    if (c[12] != (((n %= 11) < 2) ? 0 : 11 - n))
        return document.getElementById("validation").src = "../public/img/errado.png"

    for (var i = 0, n = 0; i <= 12; n += c[i] * b[i++]);
    if (c[13] != (((n %= 11) < 2) ? 0 : 11 - n))
        return document.getElementById("validation").src = "../public/img/errado.png"

    return document.getElementById("validation").src = "../public/img/corretoa.png"
}


document.getElementById('cpfVerificado').src = "../public/img/erro.png"

const { dialog } = require('electron/main')

function verificaCPF() {
    let cpf, soma, resto, dv1, dv2
    modal = document.getElementById('modal')

    cpf = document.getElementById("formCpf").value

    if (cpf.length !== 11 || cpf === "00000000000" || cpf === "11111111111" || cpf === "22222222222" || cpf === "33333333333" || cpf === "44444444444" ||
        cpf === "55555555555" || cpf === "66666666666" || cpf === "77777777777" || cpf === "88888888888" || cpf === "99999999999") {
        console.log("CPF inválido")
    } else {
        //Cálculo do primeiro dígito verificador
        soma = 0
        for (let i = 0; i < 9; i++) {
            soma += parseInt(cpf.charAt(i)) * (10 - i)
        }
        resto = 11 - (soma % 11)
        if (resto === 10 || resto === 11) {
            dv1 = 0
        } else {
            dv1 = resto
        }
        //Cálculo do segundo dígito verificador
        soma = 0
        for (let i = 0; i < 10; i++) {
            soma += parseInt(cpf.charAt(i)) * (11 - i)
        }
        resto = 11 - (soma % 11)
        if (resto === 10 || resto === 11) {
            dv2 = 0
        } else {
            dv2 = resto
        }
        //comparar os dígitos verificadores
        if (parseInt(cpf.charAt(9)) !== dv1 || parseInt(cpf.charAt(10)) !== dv2) {
            document.getElementById('cpfVerificado').src = "../public/img/erro.png"
            document.getElementById("formCpf").value = ""
            dialog.showMessageBox(winAbout, {
                type: "info",
                message: 'CPF Inválido',
                buttons: ['Ok']
            })
        } else {
            document.getElementById('cpfVerificado').src = "../public/img/correto.png"
            console.log("CPF válido")
        }
    }
    document.getElementById('formCpf').addEventListener('blur', verificaCPF);
}

function calcularMargemLucro() {
    const custo = parseFloat(document.getElementById('formValor').value);
    const margem = parseFloat(document.getElementById('lucro').value);

    if (!isNaN(custo) && !isNaN(margem)) {
        const margemLucro = parseFloat(((custo * margem) / 100) + custo);
        document.getElementById('resultado').value = margemLucro.toFixed(2);
    } else {
    }
}
