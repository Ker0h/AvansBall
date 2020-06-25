import pymongo

import BusSender

client = pymongo.MongoClient("mongodb://localhost:27017/")
product_db = client["Order_Product"]
product_db_col = product_db["order_product"]
order_write_db = client["Order_Write"]
order_write_col = order_write_db["order_write"]
order_read_db = client["Order_Read"]
order_read_col = order_read_db["order_read"]


# Insert a new order into the write database when a new order has been made.
def insert_new_order_writedb(customer_id, product_id, product_name, product_amount):
    try:
        new_order = {"Customer_id": int(customer_id),
                     "Product_id": product_id,
                     "Product_name": product_name,
                     "Product_amount": product_amount}

        order_write_col.insert_one(new_order)
        BusSender.BusSender.send_new_order_to_bus(BusSender, message=new_order)
        return True
    except Exception as e:
        return False, e


# Insert an exsisting order that went from the write db to the bus and back to this.
def insert_new_order_readdb(customer_id, product_id, product_name, product_amount):
    try:
        new_order = {"Customer_id": int(customer_id),
                     "Product_id": product_id,
                     "Product_name": product_name,
                     "Product_amount": product_amount}

        order_read_col.insert_one(new_order)
        return True
    except Exception as e:
        return False, e


# Retrieve the user's order data
def retrieve_customer_orders(customer_id):
    try:
        order_list = {}
        query = {"customer_id": customer_id}
        mydoc = order_read_col.find(query, {"_id": 0})
        counter = 0
        for x in mydoc:
            order_list[counter] = x
            counter = counter + 1
        return order_list
    except Exception as e:
        return False, e


# Insert a new product into the product database.
def insert_new_product(product_id, product_name, product_amount, product_price):
    try:
        new_product = {"Product_id": int(product_id),
                       "name": product_name,
                       "amount": int(product_amount),
                       "price": float(product_price)}

        product_db_col.insert_one(new_product)
        return True
    except Exception as e:
        return False, e


# Update the amount of a product available
def update_product_amount(product_id, new_product_amount):
    try:
        product = {"product_id": product_id}
        updated_product = {"$set": {"product_amount": new_product_amount}}

        product_db_col.update_one(product, updated_product)
        return True
    except Exception as e:
        return False, e


def delete_product(product_id):
    try:
        delete_query = {"product_id": product_id}
        product_db_col.delete_one(delete_query)
        return True
    except Exception as e:
        return False, e


# Populate the read order database for testing purposes
def populate_read_database_for_customer_test():
    try:
        new_order = {"customer_id": "1",
                     "product_id": [2, 10, 12, 60],
                     "product_name": ["Konfie", "konkie", "donker", "kaasraps"],
                     "product_amount": [500, 200, 300, 250]}

        order_read_col.insert(new_order)
        return True
    except Exception as e:
        return False, e