import pymongo
client = pymongo.MongoClient("mongodb://localhost:27017/")


def insert_new_product(product_id, product_name, product_amount, product_price):
    order_write_db = client["Order_Write"]
    order_write_col = order_write_db["order_write"]

    new_product = { "Product_id": int(product_id),
                    "name": product_name,
                    "amount": int(product_amount),
                    "price": float(product_price)}

    order_write_col.insert_one(new_product)


def retrieve_customer_orders(customer_id):
    order_read_db = client["Order_Read"]
    order_read_col = order_read_db["order_read"]

    order_list = {}
    query = {"customer_id": customer_id}
    mydoc = order_read_col.find(query, {"_id": 0})
    counter = 0
    for x in mydoc:
        order_list[counter] = x
        counter = counter + 1
    return order_list


def populate_read_database_for_customer_test():
    order_read_db = client["Order_Read"]
    order_read_col = order_read_db["order_read"]

    new_order = {"customer_id": "1",
                 "product_id": [2,10,12,60],
                 "product_name": ["Konfie", "konkie", "donker", "kaasraps"],
                 "Product_amount": [500, 200, 300, 250]}

    order_read_col.insert(new_order)
