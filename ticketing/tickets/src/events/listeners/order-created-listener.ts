import { Subjects, Listener, OrderCreatedEvent } from '@qroux-corp/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const { id, title, price } = data;
    const ticket = Ticket.findOne({
      id,
      title,
      price,
    });
    await ticket.save();

    msg.ack();
  }
}
