document.addEventListener('DOMContentLoaded', function () {
    const submit = document.getElementById("submit");
    const textFieldJson = document.getElementById("textFieldJson");
    const result = document.getElementById("result");

    const errorReasons = {
        "00001": {
            reason: "User abandoned the transaction in the Bank",
            description: "This situation happens when the user closes the browser while inside the banking portal or clicks on the cancel transaction button."
        },
        "00002": {
            reason: "Account garnished",
            description: "State in which resources cannot be debited by a court order."
        },
        "00003": {
            reason: "Inactive Account",
            description: "This situation happens when the user exceeds the time limit and there is no evidence of account movements in terms of withdrawals within a time established by the financial institution."
        },
        "00004": {
            reason: "Account does not exist",
            description: "This should be sent when the user does not have an enabled or valid account to debit the payment."
        },
        "00005": {
            reason: "Account not enabled",
            description: "State in which the resources cannot be debited given that the Financial Entity has not enabled the account for payments."
        },
        "00006": {
            reason: "Account has not been enabled",
            description: "State in which the resources cannot be debited given that the Financial Entity has not enabled the account for payments."
        },
        "00007": {
            reason: "Account settled",
            description: "Account closed by the user"
        },
        "00008": {
            reason: "User exceeds transactional limit authorized by the bank",
            description: "It only applies when the amount to be paid exceeds that controlled by the Financial Entity. Example: exceeded the amount used in the month for simplified savings type transactions."
        },
        "00009": {
            reason: "Bank is not available",
            description: "The Financial Entity is offline to generate payment transactions."
        },
        "00010": {
            reason: "Technical faults",
            description: "State in which the Financial Entity detects inconveniences in processing the transaction."
        },
        "00011": {
            reason: "Insufficient funds",
            description: "The account used by the user does not contain the value requested to fulfill the transaction."
        },
        "00012": {
            reason: "Inconsistency in transaction data",
            description: "This cause refers to a rejection caused by the type of data it receives, for example, it expects a numerical field and an alphanumeric field arrives."
        },
        "00013": {
            reason: "Account canceled",
            description: "The account is in canceled status."
        },
        "00014": {
            reason: "Cancellation of PSE - The bank did not confirm the transaction status",
            description: "If PSE does not receive confirmation via the method (confirmTransactionPayment) from the bank and neither a definitive status of the transaction in at least 3 attempts, which is carried out in 21 minutes by the PSE PROBE, upon completion of the time established for the probe, the status of the transaction becomes Refused."
        },
        "00015": {
            reason: "Transaction not concluded at the bank",
            description: "This must be generated when the user reaches the entity and the process does not generate any type of action or response. The entity must have session control in order not to exceed the probe times."
        },
        "00016": {
            reason: "Invalid access data in the bank",
            description: "It is generated when the access credentials to the Financial Entity's portal are not entered correctly by the paying user."
        },
        "00017": {
            reason: "User does not have PSE payments enabled",
            description: "Applies if the user does not have the service enabled of PSE in your Financial Entity. If the entity has by default enabled PSE service for all users, it should not generate count."
        },
        "00018": {
            reason: "Change of status in the transaction - Operated from the ACH platform",
            description: "It corresponds to the change from approved to rejected by consumer protection statute. This change is made by the Financial Entity, through the PSE administrative module."
        },
        "00019": {
            reason: "Transaction declined by pre-authorizer, suspected fraud",
            description: "It corresponds to the rejection made by the Monitor plus platform in accordance with the defined fraud prevention rules."
        },
        "00020": {
            reason: "User abandoned transaction in PSE at return to business",
            description: "The user, being on the Protected ACH (Registration) page, clicks on the 'Return to business' button."
        },
        "00021": {
            reason: "The user, being on the Protected ACH (Registration)",
            description: "The user, being on the Protected ACH (Registration) page, closes the tab or the browser completely."
        },
        "00022": {
            reason: "The browser used by the user does not support PSE",
            description: "The version of the internet browser used by the paying user is obsolete or does not correspond to those supported by the development of the Financial Entity or the company. Supported versions: Chrome 84.0, Edge 18.18363, Firefox 79.0, Opera 69.0 and Safari 13.1."
        },
        "00023": {
            reason: "User does not present activity in PSE (TIMEOUT)",
            description: "The user remains on the Protected ACH (Registration) page without clicking on the 'Go to Bank' button, which is why the timeout is generated according to the waiting time parameter in PSE."
        },
        "00024": {
            reason: "Transaction rejected due to suspicion of fraud in banking entity",
            description: "It is only used if the entity has a search engine fraud prevention and declines the operation due to suspicion of fraud."
        },
        "00025": {
            reason: "Canceled by PSE - Credibanco did not confirm transaction does not approve or deny the initiated transaction.",
            description: "When paying with a Credibanco credit card, the transaction."
        },
        "00026": {
            reason: "OTP NOT INFORMED (Valid for PSE Avanzaintegration)",
            description: "The user does not enter the OTP code and the time expires."
        },
        "00027": {
            reason: "INVALID OTP (Valid for integration of PSE Advance)",
            description: "The user entered OTP that is not valid or does not comply."
        },
    };

    submit.addEventListener("click", function () {
        const inserted = textFieldJson.value;
        let authId = null;

        try {
            // Tries to analyze as JSON
            const dataJson = JSON.parse(inserted);

            // Tries to find error code directly or inside pay_response
            if (dataJson.authorizationID) {
                authId = dataJson.authorizationID;

            } else if (dataJson.pay_response && typeof dataJson.pay_response === 'string') {
                // If there's pay_response, also tries to analyze as JSON
                try {
                    const payResponseDados = JSON.parse(dataJson.pay_response);
                    if (payResponseDados.authorizationID) {

                        authId = payResponseDados.authorizationID;
                    } else{
                        console.log("authorizationID not found inside pay_response")
                    }
                } catch (erroPayResponse) {
                    // If it fails to analyze pay_response
                    console.error("Could not analyze pay_response:", erroPayResponse);
                }
            }
        } catch (erroJson) {
            console.error("Could not analyze JSON:", erroJson);

            console.log("Trying to fallback with Regex...");
            const regex = /"authorizationID"\s*:\s*"([^"]*)"/i;
            const match = inserted.match(regex);

             // If it doesn't find a valid JSON, it tries regex (Regular Expression)
            if (match && match[1]) {
                authId = match[1];
                console.log("Found authorizationID via Regex");
            } else{
                console.log("authorizationID not found via Regex ");
            }
        }

        if (authId) {
            // Verify if code is simplified
            const foundErrors = errorReasons[authId];
            if (foundErrors) {
                result.innerHTML = `<strong>Error code:</strong> ${authId} <strong>Reason:</strong> ${foundErrors.reason} <strong>Description:</strong> ${foundErrors.description}`;
            } else {
                result.innerHTML = `Error code: ${authId} - Reason not found.`;
            }
        } else {
            result.innerHTML = "Error code could not be found.";
        }
    });
});