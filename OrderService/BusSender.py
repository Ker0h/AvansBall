import pika

# Change connection parameters to the right spot
connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
channel = connection.channel()


def send_stock_update_from_order():
    channel.queue_declare(queue='OrderStockUpdate')
    channel.basic_publish(exchange='', routing_key='hello', body='Hello World!')
    connection.close()
