from flask import Flask, request, jsonify

import DbFunctions

app = Flask(__name__)


@app.route('/order', methods=['POST'])
def new_order():
    print("Hellosworld")

    customer_id = request.json.get("customer_id", None)
    product_id = request.json.get("product_id", None)
    product_name = request.json.get("product_name", None)
    product_amount = request.json.get("product_amount", None)

    if not customer_id or not product_name or not product_amount or not product_id:
        return jsonify({"msg": "Missing parameters"}), 400

    if type(product_amount) is int:
        new_order = DbFunctions.insert_new_order_writedb(customer_id=customer_id, product_id=product_id,
                                                 product_amount=product_amount,
                                                 product_name=product_name)
        if new_order:
            return jsonify({"msg": "A new order has been created"}), 201
        else:
            print(new_order.e)

    else:
        for item in product_amount:
            if int(item) <= 0:
                return jsonify({"msg": "All amounts need to be more than 0"}), 400

        new_order = DbFunctions.insert_new_order_writedb(customer_id=customer_id, product_id=product_id,
                                                 product_amount=product_amount,
                                                 product_name=product_name)
        if new_order:
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