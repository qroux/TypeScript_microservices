import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

it('returns 400 if user not authenticated', async () => {
  const orderId = new mongoose.Types.ObjectId().toHexString();

  await request(app).get(`/api/orders/${orderId}`).send().expect(401);
});

it('returns 404 if order does not exist', async () => {
  const orderId = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .get(`/api/orders/${orderId}`)
    .set('Cookie', global.signup())
    .send()
    .expect(404);
});

it("returns 401 if not order's owner ", async () => {
  //  build a ticket
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'test name',
    price: 55,
  });
  await ticket.save();

  // build 2 user
  const userOne = global.signup();
  const userTwo = global.signup();

  // request a new order creation for this ticket
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticket.id })
    .expect(201);

  // fetch the order as authenticated but NOT owner
  await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', userTwo)
    .send()
    .expect(401);
});

it('returns 200 if order found', async () => {
  //  build a ticket
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'test name',
    price: 55,
  });
  await ticket.save();

  // build a user
  const user = global.signup();

  // request a new order creation for this ticket
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // fetch the order as the authenticated owner
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});
