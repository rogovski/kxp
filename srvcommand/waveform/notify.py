import pika
import time
import msgpack
import requests

connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost'))
channel = connection.channel()

channel.queue_declare(queue='waveform_event_log', durable=True)

def callback(ch, method, properties, body):
    requests.post('http://localhost:8484/event', data=msgpack.unpackb(body))
    ch.basic_ack(delivery_tag = method.delivery_tag)

channel.basic_qos(prefetch_count=1)
channel.basic_consume(callback,
                      queue='waveform_event_log')

channel.start_consuming()
