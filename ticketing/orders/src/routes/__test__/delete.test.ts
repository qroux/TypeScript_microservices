import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { OrderStatus } from '@qroux-corp/common';

it('returns 400 if order not found', async () => {
  // create a ticket
  const ticket = Ticket.build({
    title: 'test name',
    price: 55,
  });
  await ticket.save();

  // create a valid mongoose orderId
  const orderId = new mongoose.Types.ObjectId().toHexString();

  // request a DELETE_ORDER as user
  const { body: deletedOrder } = await request(app)
    .delete(`/api/orders/${orderId}`)
    .set('Cookie', global.signup())
    .send()
    .expect(404);
});

it("returns 401 if user not order's owner", async () => {
  // create a ticket
  const ticket = Ticket.build({
    title: 'test name',
    price: 55,
  });
  await ticket.save();

  // create a user
  const user = global.signup();

  // request a NEW_ORDER as user
  const { body: newOrder } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(newOrder.status).toEqual(OrderStatus.Created);

  // request a DELETE_ORDER as user
  const { body: deletedOrder } = await request(app)
    .delete(`/api/orders/${newOrder.id}`)
    .set('Cookie', global.signup())
    .send()
    .expect(401);
});

it('returns 200 if order successfully updated to CANCELLED status', async () => {
  // create a ticket
  const ticket = Ticket.build({
    title: 'test name',
    price: 55,
  });
  await ticket.save();

  // create a user
  const user = global.signup();

  // request a NEW_ORDER as user
  const { body: newOrder } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(newOrder.status).toEqual(OrderStatus.Created);

  // request a DELETE_ORDER as user
  const { body: deletedOrder } = await request(app)
    .delete(`/api/orders/${newOrder.id}`)
    .set('Cookie', user)
    .send()
    .expect(204);

  // request the updated order to check status
  const { body: updatedOrder } = await request(app)
    .get(`/api/orders/${newOrder.id}`)
    .set('Cookie', user)
    .send()
    .expect(200);

  expect(updatedOrder.status).toEqual(OrderStatus.Cancelled);
});

it.todo('Publish an event to other services');
