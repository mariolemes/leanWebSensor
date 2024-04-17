var err = false; // Variável para indicar falha na produção
var sensorStates = []; // Array para armazenar os estados do sensor ao longo do tempo
var errDisplay = document.getElementById('errDisplay'); // Elemento HTML para exibir o valor de err

function receiverRequest(){
    fetch(urlGet, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(json => {
        // Adiciona o estado atual do sensor ao array
        sensorStates.push(json.sensor);

        // Mantém o array com no máximo 10 elementos
        if (sensorStates.length > 10) {
            sensorStates.shift(); // Remove o primeiro elemento (o mais antigo)
        }

        // Verifica se todos os estados no array são iguais
        const allEqual = arr => arr.every(val => val === arr[0]);

        // Se todos os estados forem iguais e a planta estiver ligada, define err como true
        if (allEqual(sensorStates) && json.ligada === 1) {
            err = true;
        } else {
            err = false;
        }

        // Atualiza os elementos de exibição conforme necessário
        producaoDisplay.textContent = json.sensor;
        feedbackDisplay.textContent = json.msg;
        console.log(json.sensor);

        // Atualiza o elemento HTML com o valor de err
        errDisplay.textContent = err ? "Erro na produção" : "";
    })
}

setInterval(receiverRequest, 2000);