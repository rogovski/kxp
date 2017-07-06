
import pika
import time
import msgpack
import math

connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost'))
channel = connection.channel()

channel.queue_declare(queue='waveform_clock', durable=True)
channel.queue_declare(queue='waveform_event_log', durable=True)

def callback(ch, method, properties, body):
    obj = msgpack.unpackb(body)
    message = { 'type': 'WAVEFORM_SINE_COMPUTED', 'sine': math.sin(obj['x']) }
    channel.basic_publish(exchange='',
                          routing_key='waveform_event_log',
                          body=msgpack.packb(message),
                          properties=pika.BasicProperties(
                             delivery_mode = 2, # make message persistent
                          ))
    ch.basic_ack(delivery_tag = method.delivery_tag)

channel.basic_qos(prefetch_count=1)
channel.basic_consume(callback,
                      queue='waveform_clock')

channel.start_consuming()
