# pip install RPi.GPIO
import RPi.GPIO as GPIO

#pip install requests
import requests

import time

# define o tipo de padrão da numeração dos pinos do RASP (GPIOXX)
GPIO.setmode(GPIO.BCM)
# desabilita as msgs de atenção printadas pelo console
GPIO.setwarnings(False)

# definição dos tipos de IOs (define se entrada ou saída)
GPIO.setup(17, GPIO.IN, pull_up_down = GPIO.PUD_DOWN) #sensor
GPIO.setup(27, GPIO.OUT) #on/reset
GPIO.setup(22, GPIO.OUT) #auto
GPIO.setup(10, GPIO.OUT) #man

# url usada para buscar os dados dos botões
urlGet = 'https://leanwebsensorserver.onrender.com/chaves'
# url usada para enviar os dados do sensor
urlPost = 'https://leanwebsensorserver.onrender.com/producao'

# criando variavel para os pinos do rasp
liga = 27
auto = 22
man = 10
pin_sensor = 17
# criar algumas variáveis com valor inicial igual a 0
liga_ = 0
desliga_ = 0
restart_ = 0
sensor_old = 0
contador = 0

# criar a variavel chaves
chaves = {"liga": 0, "desliga": 0, "restart": 0}

# criar a variável a ser postada
postagem = {'sensor': contador}

while True:
    # lógica de monitoramento e tratamento dos valores do sensor
    sensor = GPIO.input(pin_sensor)
    # detector de borda de descida, com contagem de caixa
    if (sensor_old == 1) and (sensor == 0):
        sensor_old = sensor
        contador = contador + 1
        postagem = {'sensor': contador}

    # detector de borda de subida, apenas para atualizar as variáveis
    if(sensor_old == 0) and (sensor == 1):
        sensor_old = sensor

    # post dos dados do sensor para o servidor
    x = requests.post(urlPost, json = postagem)
    print(f"contador: {contador}")
    print (x.status_code)

    # armazena na variável chaves, o request do tipo GET e transforma
    # o retorno em um json
    chaves = requests.get(urlGet)
    print(chaves)
    respostaJson = chaves.json()
    # lógica de acionamento do liga, desliga e restart
    if(liga_ != respostaJson['liga'] or desliga_ != respostaJson['desliga'] or restart_ != respostaJson['restart']):
        liga_ = respostaJson['liga']
        desliga_ = respostaJson['desliga']
        restart_ = respostaJson['restart']
        if(chaves.status_code):
            if(liga_ == True):
                GPIO.output(man, 0)
                time.sleep(0.5)
                GPIO.output(auto, 1)
                GPIO.output(liga, 1)
                time.sleep(5)
                GPIO.output(liga, 0)
            if(desliga_ == True):
                GPIO.output(liga, 0)
                GPIO.output(auto, 0)
                time.sleep(0.5)
                GPIO.output(man, 1)
            if(restart_  == True):
                GPIO.output(auto, 0)
                GPIO.output(man, 1)
                time.sleep(0.5)
                GPIO.output(liga, 1)
                time.sleep(10)
                GPIO.output(liga, 0)
        else:
            continue

