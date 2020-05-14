const amqp = require('amqplib/callback_api');
const denormalize = require('../denormalize');

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

const listenToBus = () => {
  amqp.connect('amqp://localhost', (error0, connection) => {
    if (error0) {
      throw error0;
    }

    connection.createChannel((error1, channel) => {
      if (error1) {
        throw error1;
      }

      const queue = 'stock';

      channel.assertQueue(queue, {
        durable: false
      });

      console.log(
        ' [*] Waiting for messages in %s. To exit press CTRL+C',
        queue
      );
      channel.consume(
        queue,
        (msg) => {
          console.log(' [x] Received %s', msg.content.toString());
          denormalize(msg);
        },
        {
          noAck: true
        }
      );
    });
  });
};

module.exports = {
  sendToBus,
  listenToBus
};
