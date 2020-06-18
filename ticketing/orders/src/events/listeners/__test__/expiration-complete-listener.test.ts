import mongoose from 'mongoose';
import { natsWrapper } from '../../../nats-wrapper';
import { Message } from 'node-nats-streaming';

import { ExpirationCompleteListener } from '../expiration-complete-listener';
import { ExpirationCompleteEvent, OrderStatus } from '@qroux-corp/common';
import { Order } from '../../../models/order';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  // create an instance of the listener
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'test name',
    price: 55,
  });

  await ticket.save();

  const order = Order.build({
    status: OrderStatus.Created,
    userId: 'dzdqqd',
    expiresAt: new Date(),
    ticket,
  });
  await order.save();

  // Create a fake data event Object
  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id,
  };

  // Create a fake Message Object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, order, data, msg };
};

it('updates the order status to cancelled', async () => {
  const { listener, order, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emit an OrderCancelled event', async () => {
  const { listener, order, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(eventData.id).toEqual(order.id);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  // Call the onMessage function with data Objet + Message Object
  await listener.onMessage(data, msg);

  // Make sur the ack function is called
  expect(msg.ack).toHaveBeenCalled();
});
