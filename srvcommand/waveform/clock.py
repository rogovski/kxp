
import pika
import sys
import msgpack
import numpy as np
import time

connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost'))
channel = connection.channel()

channel.queue_declare(queue='waveform_clock', durable=True)

cnt = 0
N = 100
domain = np.linspace(0,2*np.pi,N)

while True:
    message = { 'x': domain[cnt] }
    channel.basic_publish(
        exchange='',
        routing_key='waveform_clock',
        body=msgpack.packb(message),
        properties=pika.BasicProperties(
            delivery_mode = 2, # make message persistent
        )
    )
    cnt += 1
    if cnt >= 100:
        cnt = 0
    time.sleep(0.1)

# connection.close()
