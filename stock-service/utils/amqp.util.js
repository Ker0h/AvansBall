const amqp = require('amqplib/callback_api');
const Denormalizer = require('../event-listeners/denormalize');

const sendToBus = (event, data) => {
  amqp.connect('amqp://localhost', (error0, connection) => {
    if (error0) {
      throw error0;
    }

    connection.createChannel((error1, channel) => {
      if (error1) {
        throw error1;
      }

      const queue = 'stock';
      const msg = {
        event,
        data
      };

      channel.assertQueue(queue, {
        durable: false
      });

      channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)));
      console.log(' [x] Sent %s', msg);

      setTimeout(() => {
        connection.close();
      }, 500);
    });
  });
};

const listenToProducts = () => {
  amqp.connect('amqp://localhost', (error0, connection) => {
    if (error0) {
      throw error0;
    }

    connection.createChannel((error1, channel) => {
      if (error1) {
        throw error1;
      }

      const queue = 'products';

      channel.assertQueue(queue, {
        durable: false
      });

      console.log(
        ' [*] Waiting for messages from %s. To exit press CTRL+C',
        queue
      );
      channel.consume(
        queue,
        (msg) => {
          console.log(' [x] Received %s', msg.content.toString());
          const denormalizer = new Denormalizer();
          denormalizer.insert(msg);
        },
        {
          noAck: true
        }
      );
    });
  });
};

const listenToSuppliers = () => {
  amqp.connect('amqp://localhost', (error0, connection) => {
    if (error0) {
      throw error0;
    }

    connection.createChannel((error1, channel) => {
      if (error1) {
        throw error1;
      }

      const queue = 'suppliers';

      channel.assertQueue(queue, {
        durable: false
      });

      console.log(
        ' [*] Waiting for messages from %s. To exit press CTRL+C',
        queue
      );
      channel.consume(
        queue,
        (msg) => {
          console.log(' [x] Received %s', msg.content.toString());
          const denormalizer = new Denormalizer();
          denormalizer.insert(msg);
        },
        {
          noAck: true
        }
      );
    });
  });
};

const listenToOrders = () => {
  amqp.connect('amqp://localhost', (error0, connection) => {
    if (error0) {
      throw error0;
    }

    connection.createChannel((error1, channel) => {
      if (error1) {
        throw error1;
      }

      const queue = 'orders';

      channel.assertQueue(queue, {
        durable: false
      });

      console.log(
        ' [*] Waiting for messages from %s. To exit press CTRL+C',
        queue
      );
      channel.consume(
        queue,
        (msg) => {
          console.log(' [x] Received %s', msg.content.toString());
          const denormalizer = new Denormalizer();
          denormalizer.insert(msg);
        },
        {
          noAck: true
        }
      );
    });
  });
};

const listenToBus = () => {
  listenToProducts();
  listenToSuppliers();
  listenToOrders();
};

module.exports = {
  sendToBus,
  listenToBus
};
