document.addEventListener('DOMContentLoaded', function() {
    const botaoExtrair = document.getElementById("botaoExtrair");
    const campoTextoJson = document.getElementById("campoTextoJson");
    const paragrafoResultado = document.getElementById("resultado");
  
    const motivosErro = {
      "00001":{
        motivo: " User  abandoned  the  transaction  in  the Bank",
        descricao: "This  situation  happens  when  the  user closes  the browser  while  inside  the banking  portal  or  click  on  the  cancel transaction  button."
      },
      "00002":{
        motivo: "Account  garnished",
        descricao: " State  in  which  resources  cannot  be  debited  by  a  court  order."
      },
      "00003": {
        motivo: "Inactive Account",
        descricao: " This  situation  happens  when  the  user  exceeds  the  time  limit and  there  is  no  evidence  of  account  movements  in  terms  of withdrawals  within  a  time  established  by  the  financial  institution."
      },
      "00004": {
        motivo: "Account  does  not  exist",
        descricao: "This  should  be  sent  when  the  user  does  not  have an  enabled  or  valid  account  to  debit  the  payment."
      },
      "00005": {
        motivo: "Account  not  enabled",
        descricao: "State  in  which  the  resources  cannot  be  debited  given  that  the Financial  Entity  has  not  enabled  the  account  for  payments."
      },
      "00006": {
        motivo: "Account  has  not  been  enabled",
        descricao: "Esse número de conta não existe"
      },
      "00026": {
        motivo: "Número de conta inválido",
        descricao: "Esse número de conta não existe"
      },
      "00026": {
        motivo: "Número de conta inválido",
        descricao: "Esse número de conta não existe"
      },
      "00026": {
        motivo: "Número de conta inválido",
        descricao: "Esse número de conta não existe"
      },
      "00026": {
        motivo: "Número de conta inválido",
        descricao: "Esse número de conta não existe"
      },
      "00026": {
        motivo: "Número de conta inválido",
        descricao: "Esse número de conta não existe"
      },
      "00026": {
        motivo: "Número de conta inválido",
        descricao: "Esse número de conta não existe"
      },
      "00026": {
        motivo: "Número de conta inválido",
        descricao: "Esse número de conta não existe"
      },
      "00026": {
        motivo: "Número de conta inválido",
        descricao: "Esse número de conta não existe"
      },
      //Códigos de Exemplo
    };
  
    botaoExtrair.addEventListener("click", function() {
      const textoInserido = campoTextoJson.value;
      let idAutorizacao = null;
  
      try {
        // Tentar analisar como JSON
        const dadosJson = JSON.parse(textoInserido);
  
        // Tentar encontrar authorizationID diretamente ou dentro de pay_response
        if (dadosJson.authorizationID) {
          idAutorizacao = dadosJson.authorizationID;
        } else if (dadosJson.pay_response) {
          // Se tiver pay_response, tenta analisar como JSON também
          try {
            const payResponseDados = JSON.parse(dadosJson.pay_response);
            if (payResponseDados.authorizationID) {
              idAutorizacao = payResponseDados.authorizationID;
            }
          } catch (erroPayResponse) {
            // Se falhar ao analisar pay_response
            console.error("Erro ao analisar pay_response:", erroPayResponse);
          }
        }
  
      } catch (erroJson) {
        console.error("Erro ao analisar JSON:", erroJson);
      }
  
      // Se não encontrou JSON válido, tenta com regex (Regular Expression)
      if (!idAutorizacao) {
        const regex = /"authorizationID"\s*:\s*"([^"]*)"/i;
        const correspondencia = textoInserido.match(regex);
  
        if (correspondencia) {
          idAutorizacao = correspondencia[1];
        }
      }
  
      if (idAutorizacao) {
        // Verificar se o código tem um significado
        const motivoErroEncontrado = motivosErro[idAutorizacao];
        if (motivoErroEncontrado) {
          paragrafoResultado.innerHTML = `<strong>ID de Autorização:</strong> ${idAutorizacao} <strong>Motivo:</strong> ${motivoErroEncontrado.motivo} <strong>Descrição:</strong> ${motivoErroEncontrado.descricao}`;
        } else {
          paragrafoResultado.innerHTML = `ID de Autorização: ${idAutorizacao} - Motivo não encontrado`;
        }
      } else {
        paragrafoResultado.innerHTML = "ID de Autorização não encontrado.";
      }
    });
  });