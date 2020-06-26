import json

import pika

import DbFunctions

connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost'))
channel = connection.channel()

channel.queue_declare(queue='stock')


def callback(ch, method, properties, body):
    print(" [x] Received %r" % body)
    decoded_message = json.loads(body)
    DbFunctions.insert_new_order_readdb(
        decoded_message.get("order").get("dictionary").get("customer_id"),
        decoded_message.get("order").get("dictionary").get("product_id"),
        decoded_message.get("order").get("dictionary").get("product_name"),
        decoded_message.get("order").get("dictionary").get("product_amount")
    )

    # if 1 == 1:
    #     DbFunctions.insert_new_product()
    # elif 2 == 2:
    #     DbFunctions.update_product_amount()
    # elif 3 == 3:
    #     DbFunctions.delete_product()


channel.basic_consume(
    queue='stock', on_message_callback=callback, auto_ack=True)

print(' [*] Waiting for messages. To exit press CTRL+C')
channel.start_consuming()
