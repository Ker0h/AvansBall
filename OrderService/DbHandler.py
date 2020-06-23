import pymongo

client = pymongo.MongoClient("mongodb://localhost:27017/")

# Getting a list of all current databases
db_list = client.list_database_names()

# checking if the write database exists, if not create it
if "Order_Write" in db_list:
  print("The order write database exists.")
  order_write_db = client["Order_Write"]
else:
    order_write_db = client["Order_Write"]
    print("Order write database has been made")

# checking if the read database exists, if not, create it
if "Order_Read" in db_list:
    print("The order read database exists.")
    order_read_db = client["Order_Read"]
else:
    order_read_db = client["Order_Read"]
    print("Order read database has been made")

# checking is the product database exists, if not, create it
if "Order_Product" in db_list:
    print("The product database exsists")
    product_db = client["Order_Product"]
else:
    product_db = client["Order_Product"]
    print("The product database has been made")

# check if the order write collection exists, if not, create it
col_write_list = order_write_db.list_collection_names()
if "order_write" in col_write_list:
  print("The order_write collections exists.")
  order_write_col = order_write_db["order_write"]
else:
    order_write_col = order_write_db["order_write"]

# check if the order read collection exists, if not create it
col_read_list = order_read_db.list_collection_names()
if "order_read" in col_read_list:
  print("The order-read collection exists.")
  order_read_col = order_read_db["order_read"]
else:
    order_read_col = order_read_db["order_read"]

# check if the product collection exsists, if not, create it
col_product_list = product_db.list_collection_names()
if "product" in col_product_list:
    print("The product collection exsist.")
    product_col = product_db["product"]
else:
    product_col = product_db["product"]
    print("The product collection has been made")

# mydict = { "name": "John", "address": "Highway 37" }
#
#
# x = order_write_col.insert_one(mydict)
# y = order_read_col.insert_one(mydict)

print(db_list)
print(order_write_db)
print(order_read_db)
print(order_write_db.list_collection_names())
print(order_read_db.list_collection_names())
print(order_write_col.find_one())
print(order_read_col.find_one())
#
# order_write_col.delete_many({})
# order_read_col.delete_many({})

