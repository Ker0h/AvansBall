import json
import traceback

import pika
from bson import ObjectId

# Change connection parameters to the right spot
connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))


class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)


class BusSender:
    def __init__(self, config):
        self.config = config

    def send_new_order_to_bus(self, message):
        try:
            channel = connection.channel()
            channel.queue_declare(queue='new_order')
            print(message)
            channel.basic_publish(exchange='', routing_key='new_order', body=JSONEncoder().encode(message))
        except Exception as e:
            print(repr(e))
            traceback.print_exc()
            raise e
        finally:
            if connection:
                connection.close()

    def send_update_stock(self, message):
        try:
            channel = connection.channel()
            channel.queue_declare(queue="stock")
            print(message)
            channel.basic_publish(exchange='', routing_key='stock_update', body=JSONEncoder().encode(message))
        except Exception as e:
            print(repr(e))
            traceback.print_exc()
            raise e
        finally:
            if connection:
                connection.close()