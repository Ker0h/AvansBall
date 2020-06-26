from flask import Flask, request, jsonify

import DbFunctions
from Events.EvenOrderCreated import EventOrderCreated
from Events.EventStockUpdated import EventStockUpdated

app = Flask(__name__)


@app.route('/order', methods=['POST'])
def new_order():

    customer_id = request.json.get("customer_id", None)
    product_id = request.json.get("product_id", None)
    product_name = request.json.get("product_name", None)
    product_amount = request.json.get("product_amount", None)

    if not customer_id or not product_name or not product_amount or not product_id:
        return jsonify({"msg": "Missing parameters"}), 400

    if type(product_amount) is int:

        new_order_query = {"customer_id": int(customer_id),
                           "product_id": product_id,
                           "product_name": product_name,
                           "product_amount": product_amount}
        stock_dict = {
            "product_id": product_id,
            "product_amount": product_amount
        }
        event_order_created = EventOrderCreated(dictionary=new_order_query)
        event_stock_update = EventStockUpdated(dictionary=stock_dict)
        order_event = {
            "event": event_order_created.__class__.__name__,
            "order": event_order_created.__dict__
        }
        stock_event = {
            "event": event_stock_update.__class__.__name__,
            "order": event_stock_update.__dict__
        }

        new_order = DbFunctions.insert_new_order_writedb(new_order_query, order_event)
        if new_order:

            DbFunctions.add_event(order_event)
            DbFunctions.add_event(stock_event)
            return jsonify({"msg": "A new order has been created"}), 201
        else:
            print(new_order.e)

    else:
        for item in product_amount:
            if int(item) <= 0:
                return jsonify({"msg": "All amounts need to be more than 0"}), 400
        new_order_query = {"customer_id": int(customer_id),
                           "product_id": product_id,
                           "product_name": product_name,
                           "product_amount": product_amount}
        stock_dict = {
            "product_id": product_id,
            "product_amount": product_amount
        }
        event_order_created = EventOrderCreated(dictionary=new_order_query)
        event_stock_update = EventStockUpdated(dictionary=stock_dict)
        order_event = {
            "event": event_order_created.__class__.__name__,
            "order": event_order_created.__dict__
        }
        stock_event = {
            "event": event_stock_update.__class__.__name__,
            "order": event_stock_update.__dict__
        }

        new_order = DbFunctions.insert_new_order_writedb(new_order_query, order_event)
        if new_order:

            DbFunctions.add_event(order_event)
            DbFunctions.add_event(stock_event)
            return jsonify({"msg": "A new order has been created"}), 201
        else:
            print(new_order.e)


@app.route('/order/<customer_id>', methods=['GET'])
def get_order(customer_id):
    # print(customer_id)
    # DbFunctions.populate_read_database_for_customer_test()
    order_list = DbFunctions.retrieve_customer_orders(customer_id)
    if order_list:
        print(order_list)
        return jsonify({"msg": order_list}), 200
    else:
        return jsonify({"msg": "No orders have been found fo this customer"}), 404


if __name__ == '__main__':
    app.run()
