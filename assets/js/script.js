document.addEventListener('DOMContentLoaded', function() {
    const botaoExtrair = document.getElementById("botaoExtrair");
    const campoTextoJson = document.getElementById("campoTextoJson");
    const paragrafoResultado = document.getElementById("resultado");
  
    const motivosErro = {
      "00023": "Número de conta inválido",
      "00024": "Saldo insuficiente",
      "00025": "Transação não permitida",
      "00026": "Cartão bloqueado"
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
        const significado = motivosErro[idAutorizacao];
        if (significado) {
          paragrafoResultado.textContent = `ID de Autorização: ${idAutorizacao} - Motivo: ${significado}`;
        } else {
          paragrafoResultado.textContent = `ID de Autorização: ${idAutorizacao} - Motivo não encontrado`;
        }
      } else {
        paragrafoResultado.textContent = "ID de Autorização não encontrado.";
      }
    });
  });