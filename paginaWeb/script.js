const ligarButton = document.getElementById('ligarButton');
const desligarButton = document.getElementById('desligarButton');
const restartButton = document.getElementById('restartButton');
const producaoDisplay = document.getElementById('producaoDisplay');
const erroDisplay = document.getElementById('erroDisplay');
const urlPost = 'https://leanwebsensor-svr.onrender.com/chaves'
const urlGet = 'https://leanwebsensor-svr.onrender.com/producao'

var lastSensorValue; // Último valor do sensor
var lastSensorTimestamp; // Timestamp do último valor do sensor


function receiverRequest(){
    fetch(urlGet, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(json => {
        producaoDisplay.textContent = json.sensor;
        feedbackDisplay.textContent = json.msg;

        // Verifica se o status da produção é "Ligado" e se o sensor não mudou nos últimos 10 segundos
        if (json.msg === "Ligado" && lastSensorValue === json.sensor && (Date.now() - lastSensorChangeTime) >= 10000) {
            erroDisplay.textContent = "Erro: Sensor não alterou por 10 segundos.";
        }
        
        // Se o valor do sensor mudou, atualiza o timestamp da última mudança de estado
        if (lastSensorValue !== json.sensor) {
            lastSensorChangeTime = Date.now();
        }

        lastSensorValue = json.sensor;

        console.log(json.sensor);
    })
}

setInterval(receiverRequest, 2000)  

ligarButton.addEventListener('click', () => {
    let requestData = {"liga": 1, "desliga": 0, "restart": 0}
    sendRequest(requestData)
});

desligarButton.addEventListener('click', () => {
    let requestData = {"liga": 0, "desliga": 1, "restart": 0}
    sendRequest(requestData)
});

restartButton.addEventListener('click', () => {
    let requestData = {"liga": 0, "desliga": 0, "restart": 1}
    sendRequest(requestData)
});

function sendRequest(data){
    fetch(urlPost, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
}