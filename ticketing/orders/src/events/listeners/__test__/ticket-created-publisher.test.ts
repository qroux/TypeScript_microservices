import mongoose from 'mongoose';
import { natsWrapper } from '../../../nats-wrapper';
import { Message } from 'node-nats-streaming';

import { TicketCreatedListener } from '../ticket-created-listener';
import { TicketCreatedEvent } from '@qroux-corp/common';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  // create an instance of the listener
  const listener = new TicketCreatedListener(natsWrapper.client);

  // Create a fake data event Object
  const data: TicketCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    title: 'test title',
    price: 55,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // Create a fake Message Object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('creates and saves a ticket', async () => {
  const { listener, data, msg } = await setup();

  // Call the onMessage function with data Objet + Message Object
  await listener.onMessage(data, msg);

  // Make sure the ticket is Created
  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  // Call the onMessage function with data Objet + Message Object
  await listener.onMessage(data, msg);

  // Make sur the ack function is called
  expect(msg.ack).toHaveBeenCalled();
});
