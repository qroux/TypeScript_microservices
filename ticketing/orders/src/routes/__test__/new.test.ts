import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { Order, OrderStatus } from '../../models/order';

it('returns an error if ticket does not exist', async () => {
  const ticketId = mongoose.Types.ObjectId();

  const response = await request(app)
    .post('/api/orders')
    .set('Cookie', global.signup())
    .send({ ticketId })
    .expect(404);
});

it('returns an error is ticket is already reserved', async () => {
  const ticket = Ticket.build({
    title: 'test name',
    price: 55,
  });
  await ticket.save();

  const order = Order.build({
    ticket,
    userId: 'eibfspif',
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });
  await order.save();

  const response = await request(app)
    .post('/api/orders')
    .set('Cookie', global.signup())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it('reserves a ticket', async () => {
  const ticket = Ticket.build({
    title: 'test name',
    price: 55,
  });
  await ticket.save();

  const response = await request(app)
    .post('/api/orders')
    .set('Cookie', global.signup())
    .send({ ticketId: ticket.id })
    .expect(201);
});

it.todo('emits an ORDER_CREATED event when created');
