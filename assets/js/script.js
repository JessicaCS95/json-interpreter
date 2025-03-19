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
        descricao: "State in which the resources cannot be debited given that the Financial Entity has not enabled the account for payments."
      },
      "00007": {
        motivo: "Account settled",
        descricao: "Account closed by the user"
      },
      "00008": {
        motivo: "User exceeds transactional limit authorized by the bank",
        descricao: "It only applies when the amount to be paid exceeds that controlled by the Financial Entity. Example exceeded the amount used in the month for simplified savings type transactions."
      },
      "00009": {
        motivo: "Bank is not available",
        descricao: "The Financial Entity is offline to generate payment transactions."
      },
      "00010": {
        motivo: "Technical faults",
        descricao: "State in which the Financial Entity detects inconveniences in processing the transaction."
      },
      "00011": {
        motivo: "Insufficient funds",
        descricao: "The account used by the user does not contain the value requested to fulfill the transaction"
      },
      "00012": {
        motivo: "Inconsistency in transaction data",
        descricao: "This cause refers to a rejection caused by the type of data it receives, for example it expects a numerical field and an alphanumeric field arrives"
      },
      "00013": {
        motivo: "Account canceled",
        descricao: "The account is in canceled status"
      },
      "00014": {
        motivo: "Cancellation of PSE- The bank did not confirm the transaction status",
        descricao: "If PSE does not receive confirmation via the method (confirmTransactionPayment) from the bank and neither a definitive status of the transaction in at least 3 attempts, which is carried out in 21 minutes by the PSE PROBE, upon completion of the time established for the probe, the status of the transaction becomes Refused"
      },
      "00015": {
        motivo: "Transaction not concluded at the bank",
        descricao: "This must be generated when the user reaches the entity and the process does not generate any type of action or response, the entity must have session control in order not to exceed the probe times."
      },
      "00016": {
        motivo: "Invalid access data in the bank",
        descricao: "It is generated when the access credentials to the Financial Entity's portal are not entered correctly by the paying user."
      },
      "00017": {
        motivo: "User does not have PSE payments enabled",
        descricao: "Applies if the user does not have the service enabled of PSE in your Financial Entity. If the entity has By default enabled PSE service for all users should not generate count"


      },
      "00018": {
        motivo: "Change of status in the transaction -Operated from the ACH platform",
        descricao: "It corresponds to the change from approved to rejected by consumer protection statute. This change is made by the Financial Entity, through the PSE administrative module "
      },
      "00019": {
        motivo: "Transaction declined by pre-authorizer, suspected fraud",
        descricao: "It corresponds to the rejection made by the Monitor plus platform in accordance with the defined fraud prevention rules."
      },
      "00020": {
        motivo: "User abandoned transaction in PSE at return to business",
        descricao: "The user, being on the Protected ACH (Registration) page, clicks on the “Return to business” button."
      },
      "00021": {
        motivo:  "The user, being on the Protected ACH (Registration)",
        descricao: "The user, being on the Protected ACH (Registration) page, closes the tab or the browser completely"
      },
      "00022": {
        motivo: "The browser used by the user does not support PSE",
        descricao: "The version of the internet browser used by the paying user is obsolete or does not correspond to those supported by the development of the Financial Entity or the company. Supported versions: Chrome 84.0, Edge 18.18363, Firefox 79.0, Opera 69.0 and Safari 13.1."
      },
      "00023": {
        motivo: "User does not present activity in PSE (TIMEOUT)",
        descricao: "The user remains on the Protected ACH (Registration) page without clicking on the “Go to Bank” button, which is why the time out is generated according to the waiting time parameter in PSE"

      },
      "00024": {
        motivo: "Transaction rejected due to suspicion of fraud in banking entity",
        descricao: "It is only used if the entity has a search engine fraud prevention and declines the operation due to suspicion of fraud."
      },
      "00025": {
        motivo: "Canceled by PSE - Credibanco did not confirm transaction does not approve or deny the initiated transaction. ",
        descricao: "Esse número de conta não existe"
      },
      "00026": {
        motivo: "OTP NOT INFORMED (Valid for PSE Avanzaintegration)",
        descricao: "Esse número de conta não existe"
      },
      "00027": {
        motivo: "INVALID OTP (Valid for integration of PSE Advance)",
        descricao: "The user entered OTP that is not valid or does not comply"
      },

      
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