import json

import pika

import DbFunctions

connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost'))
channel = connection.channel()

channel.queue_declare(queue='new_order')


def callback(ch, method, properties, body):
    print(method.delivery_tag)
    print(" [x] Received %r" % body)
    decoded_message = json.loads(body)
    DbFunctions.insert_new_order_readdb(
        decoded_message.get("Customer_id"),
        decoded_message.get("Product_id"),
        decoded_message.get("Product_name"),
        decoded_message.get("Product_amount")
    )


channel.basic_consume(
    queue='new_order', on_message_callback=callback, auto_ack=True)

print(' [*] Waiting for messages. To exit press CTRL+C')
channel.start_consuming()
